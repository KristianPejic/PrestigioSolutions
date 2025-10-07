import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-year-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './year-animation.html',
  styleUrls: ['./year-animation.css']
})
export class YearAnimationComponent implements OnInit {
  scrollProgress = 0; // 0 to 1

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Initialize scroll progress
    this.calculateScrollProgress();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.calculateScrollProgress();
  }

  private calculateScrollProgress(): void {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Detect screen size for different scroll behavior
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile: Calculate based on element position relative to viewport center
      const elementCenter = rect.top + (rect.height / 2);
      const screenCenter = windowHeight / 2;
      const distanceFromCenter = elementCenter - screenCenter;

      // Start animation only after element is well past center
      const mobileDelay = windowHeight * 0.5; // Half screen delay after centering

      if (distanceFromCenter > -mobileDelay) {
        // Element hasn't reached trigger point yet
        this.scrollProgress = 0;
      } else {
        // Animation starts after delay
        const scrollAfterDelay = Math.abs(distanceFromCenter) - mobileDelay;
        const zoomRange = windowHeight * 1.5;
        this.scrollProgress = Math.min(1, scrollAfterDelay / zoomRange);
      }
    } else {
      // Desktop: Animation starts when centered
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

  // Calculate opacity for the entire year (fade out as zoom progresses)
  getYearOpacity(): number {
    // Fade out faster - start fading at 30% progress instead of 50%
    if (this.scrollProgress < 0.3) {
      return 1;
    }
    return 1 - ((this.scrollProgress - 0.3) / 0.7);
  }

  // Calculate horizontal offset for side digits (push them away)
  getDigitOffset(position: 'first' | 'second' | 'third'): number {
    const maxOffset = 300; // Maximum pixels to move
    const offset = this.scrollProgress * maxOffset;

    switch(position) {
      case 'first':
        return -offset * 2; // First digit "2" moves left fastest
      case 'second':
        return -offset * 1.5; // Second digit "0" moves left
      case 'third':
        return offset * 1.5; // Third digit "2" moves right
      default:
        return 0;
    }
  }

  // Calculate scale for the middle 0 (zoom target - the portal)
  getZeroScale(): number {
    // Scale from 1 to 30 with accelerated easing for faster zoom
    const minScale = 1;
    const maxScale = 30;
    // Use exponential easing for faster acceleration
    const easedProgress = Math.pow(this.scrollProgress, 0.7);
    return minScale + (easedProgress * (maxScale - minScale));
  }

  // Get the clip-path for the middle "0" to create inner animation
  getClipPath(): string {
    // As we zoom in, reveal content inside the "0"
    // Start with no reveal, end with full reveal
    const revealProgress = Math.max(0, (this.scrollProgress - 0.3) / 0.7);
    const inset = 50 - (revealProgress * 50); // Start at 50% inset, end at 0%
    return `inset(${inset}% ${inset}% ${inset}% ${inset}% round 10%)`;
  }

  // Get text opacity - appears and disappears with the animation
  getTextOpacity(): number {
    // Mobile text appears earlier since animation starts on visibility
    const isMobile = window.innerWidth < 768;
    const fadeInStart = isMobile ? 0.25 : 0.2;
    const fadeInEnd = isMobile ? 0.45 : 0.4;

    // Fade in
    if (this.scrollProgress < fadeInStart) {
      return 0;
    }
    if (this.scrollProgress < fadeInEnd) {
      return (this.scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
    }
    // Stay visible until 80%
    if (this.scrollProgress < 0.8) {
      return 1;
    }
    // Fade out from 80% to 100%
    return 1 - ((this.scrollProgress - 0.8) / 0.2);
  }

  // Get text scale - starts small, grows big (responsive to screen size)
  getTextScale(): number {
    // Detect mobile for adjusted scaling
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;

    // Start very small, scale up (smaller max scale for desktop)
    const minScale = isSmallMobile ? 0.2 : (isMobile ? 0.25 : 0.3);
    const maxScale = isSmallMobile ? 1.2 : (isMobile ? 1.5 : 1.8);
    const easedProgress = Math.pow(this.scrollProgress, 0.6);
    return minScale + (easedProgress * (maxScale - minScale));
  }

  // Get text transform with cyan glow effect
  getTextTransform(): string {
    // Calculate vertical movement - moves down on mobile
    const isMobile = window.innerWidth < 768;
    const verticalMove = isMobile ? this.scrollProgress * 10 : -this.scrollProgress * 20;

    const scale = this.getTextScale();

    return `translate(-50%, calc(-50% + ${verticalMove}px)) scale(${scale})`;
  }

  // Optional: if you want to use visibility control instead of offset
  getDigitVisibility(position: 'first' | 'second' | 'third'): string {
    // Completely hide side digits when zoom starts
    if (this.scrollProgress > 0.2) return 'none';
    return 'inline-block';
  }
}
