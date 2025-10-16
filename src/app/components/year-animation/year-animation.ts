import { Component, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollProgressService } from '../../services/scroll-progress.service';
import { ResizeService } from '../../services/resize.service';
import { Throttle } from '../../utils/decorators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-year-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './year-animation.html',
  styleUrls: ['./year-animation.css']
})
export class YearAnimationComponent implements OnInit, OnDestroy {
  scrollProgress = 0;
  private isMobile = false;
  private resizeSubscription?: Subscription;

  constructor(
    private elementRef: ElementRef,
    private scrollProgressService: ScrollProgressService,
    private resizeService: ResizeService
  ) {}

  ngOnInit(): void {
    this.isMobile = this.resizeService.isMobile();
    this.calculateScrollProgress();

    this.resizeSubscription = this.resizeService.resize$.subscribe(screenSize => {
      this.isMobile = screenSize.isMobile;
      this.calculateScrollProgress();
    });
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe();
  }

  @HostListener('window:scroll', [])
  @Throttle(16)
  onWindowScroll(): void {
    this.calculateScrollProgress();
  }

  private calculateScrollProgress(): void {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (this.isMobile) {
      const elementCenter = rect.top + (rect.height / 2);
      const screenCenter = windowHeight / 2;
      const distanceFromCenter = elementCenter - screenCenter;

      const mobileDelay = windowHeight * 0.5;

      if (distanceFromCenter > -mobileDelay) {
        this.scrollProgress = 0;
      } else {
        const scrollAfterDelay = Math.abs(distanceFromCenter) - mobileDelay;
        const zoomRange = windowHeight * 1.5;
        this.scrollProgress = Math.min(1, scrollAfterDelay / zoomRange);
      }
    } else {
      const elementCenter = rect.top + (rect.height / 2);
      const screenCenter = windowHeight / 2;
      const distanceFromCenter = elementCenter - screenCenter;

      if (distanceFromCenter > 0) {
        this.scrollProgress = 0;
      } else {
        const scrollAfterCenter = Math.abs(distanceFromCenter);
        const zoomRange = windowHeight * 1.2;
        this.scrollProgress = Math.min(1, scrollAfterCenter / zoomRange);
      }
    }
  }

  getYearOpacity(): number {
    if (this.scrollProgress < 0.3) {
      return 1;
    }
    return 1 - ((this.scrollProgress - 0.3) / 0.7);
  }

  getDigitOffset(position: 'first' | 'second' | 'third'): number {
    const maxOffset = 300;
    const offset = this.scrollProgress * maxOffset;

    switch(position) {
      case 'first':
        return -offset * 2;
      case 'second':
        return -offset * 1.5;
      case 'third':
        return offset * 1.5;
      default:
        return 0;
    }
  }

  getZeroScale(): number {
    const minScale = 1;
    const maxScale = 30;
    const easedProgress = Math.pow(this.scrollProgress, 0.7);
    return minScale + (easedProgress * (maxScale - minScale));
  }

  getTextOpacity(): number {
    const isMobile = window.innerWidth < 768;
    const fadeInStart = isMobile ? 0.25 : 0.2;
    const fadeInEnd = isMobile ? 0.45 : 0.4;

    if (this.scrollProgress < fadeInStart) {
      return 0;
    }
    if (this.scrollProgress < fadeInEnd) {
      return (this.scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
    }
    if (this.scrollProgress < 0.8) {
      return 1;
    }
    return 1 - ((this.scrollProgress - 0.8) / 0.2);
  }

  getTextScale(): number {
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;

    const minScale = isSmallMobile ? 0.2 : (isMobile ? 0.25 : 0.3);
    const maxScale = isSmallMobile ? 1.2 : (isMobile ? 1.5 : 1.8);
    const easedProgress = Math.pow(this.scrollProgress, 0.6);
    return minScale + (easedProgress * (maxScale - minScale));
  }

  getTextTransform(): string {
    const isMobile = window.innerWidth < 768;
    const verticalMove = isMobile ? this.scrollProgress * 10 : -this.scrollProgress * 20;

    const scale = this.getTextScale();

    return `translate(-50%, calc(-50% + ${verticalMove}px)) scale(${scale})`;
  }
}
