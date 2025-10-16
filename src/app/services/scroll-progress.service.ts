import { Injectable } from '@angular/core';

export interface ScrollProgress {
  progress: number;
  isVisible: boolean;
  hasPassed: boolean;
  isAbove: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ScrollProgressService {

  getElementProgress(element: HTMLElement, threshold: number = 0.7): ScrollProgress {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const hasPassed = rect.bottom < windowHeight * 0.3;
    const isVisible = rect.top < windowHeight * threshold && rect.bottom > windowHeight * 0.3;
    const isAbove = rect.top > windowHeight * threshold;

    let progress = 0;
    if (rect.top < windowHeight && rect.bottom > 0) {
      const viewportCenter = windowHeight / 2;
      const elementCenter = rect.top + (rect.height / 2);
      const distance = Math.abs(elementCenter - viewportCenter);
      progress = Math.max(0, Math.min(1, 1 - (distance / windowHeight)));
    }

    return {
      progress,
      isVisible,
      hasPassed,
      isAbove
    };
  }

  getScrollBasedProgress(element: HTMLElement, startOffset: number = 0, range: number = 1): number {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + (rect.height / 2);
    const screenCenter = windowHeight / 2;
    const distanceFromCenter = elementCenter - screenCenter;

    if (distanceFromCenter > -startOffset) {
      return 0;
    }

    const scrollAfterDelay = Math.abs(distanceFromCenter) - startOffset;
    const zoomRange = windowHeight * range;
    return Math.min(1, scrollAfterDelay / zoomRange);
  }

  isElementInViewport(element: HTMLElement, threshold: number = 0): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
    );
  }
}
