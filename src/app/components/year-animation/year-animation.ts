import { Component, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeService } from '../../services/resize.service';
import { Throttle } from '../../utils/decorators';
import { Subscription } from 'rxjs';

interface Particle {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  xOffset: number;
  yOffset: number;
}

@Component({
  selector: 'app-year-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './year-animation.html',
  styleUrls: ['./year-animation.css']
})
export class YearAnimationComponent implements OnInit, OnDestroy {
  scrollProgress = 0;
  particles: Particle[] = [];
  private isMobile = false;
  private resizeSubscription?: Subscription;

  constructor(
    private elementRef: ElementRef,
    private resizeService: ResizeService
  ) {}

  ngOnInit(): void {
    this.isMobile = this.resizeService.isMobile();
    this.generateParticles();
    this.calculateScrollProgress();

    this.resizeSubscription = this.resizeService.resize$.subscribe(screenSize => {
      this.isMobile = screenSize.isMobile;
      this.calculateScrollProgress();
    });
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe();
  }

  private generateParticles(): void {
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const radius = Math.random() * 15 + 35;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      const xOffset = (Math.random() - 0.5) * 200;
      const yOffset = (Math.random() - 0.5) * 200;

      this.particles.push({
        x,
        y,
        size: Math.random() * 6 + 3,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 3,
        xOffset,
        yOffset
      });
    }
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
    const elementCenter = rect.top + (rect.height / 2);
    const screenCenter = windowHeight / 2;
    const distanceFromCenter = elementCenter - screenCenter;

    if (this.isMobile) {
      const mobileDelay = windowHeight * 0.1;

      if (distanceFromCenter > -mobileDelay) {
        this.scrollProgress = 0;
      } else {
        const scrollAfterDelay = Math.abs(distanceFromCenter) - mobileDelay;
        const zoomRange = windowHeight * 0.8; // Faster zoom on mobile
        this.scrollProgress = Math.min(1, scrollAfterDelay / zoomRange);
      }
    } else {
      if (distanceFromCenter > 0) {
        this.scrollProgress = 0;
      } else {
        const scrollAfterCenter = Math.abs(distanceFromCenter);
        const zoomRange = windowHeight * 0.9; // Faster zoom on desktop
        this.scrollProgress = Math.min(1, scrollAfterCenter / zoomRange);
      }
    }

    this.applyParticleOffsets();
  }

  private applyParticleOffsets(): void {
    // Particles are now static - no animation offsets needed
    // Keeping method for future use if needed
  }

  getYearOpacity(): number {
    // Year digits fade out as text appears and zero zooms
    if (this.scrollProgress < 0.15) return 1;
    if (this.scrollProgress < 0.35) {
      return 1 - ((this.scrollProgress - 0.15) / 0.2);
    }
    return 0; // Completely gone by 35% progress
  }

  getDigitOffset(position: 'first' | 'second' | 'third'): number {
    const maxOffset = 300;
    const offset = this.scrollProgress * maxOffset;

    switch(position) {
      case 'first': return -offset * 2;
      case 'second': return -offset * 1.5;
      case 'third': return offset * 1.5;
      default: return 0;
    }
  }

  getZeroScale(): number {
    const minScale = 1;
    const maxScale = 30;
    // More aggressive easing for faster, more dramatic zoom
    const easedProgress = Math.pow(this.scrollProgress, 0.5);
    return minScale + (easedProgress * (maxScale - minScale));
  }

  getParticleOpacity(): number {
    // Particles appear and fade out with the portal animation
    if (this.scrollProgress < 0.25) return 0;
    if (this.scrollProgress < 0.4) return (this.scrollProgress - 0.25) / 0.15;
    if (this.scrollProgress < 0.92) return 1;
    // Fade out with the text as zero goes off screen
    return 1 - ((this.scrollProgress - 0.92) / 0.08);
  }

  getRingOpacity(): number {
    // Rings are hidden - return 0
    return 0;
  }

  getTextOpacity(): number {
    // Text appears immediately as zoom starts, then fades as zero goes off screen
    const isMobile = window.innerWidth < 768;

    // Fade in timing - starts right away with the zoom
    const fadeInStart = isMobile ? 0.1 : 0.15;
    const fadeInEnd = isMobile ? 0.35 : 0.4;

    // Fade out timing - text disappears as zero goes off screen
    const fadeOutStart = 0.92;
    const fadeOutEnd = 1.0;

    // Fade in phase - text emerges as zoom begins
    if (this.scrollProgress < fadeInStart) return 0;
    if (this.scrollProgress < fadeInEnd) {
      return (this.scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
    }

    // Stay visible phase - throughout the zoom
    if (this.scrollProgress < fadeOutStart) return 1;

    // Fade out phase - text disappears with the zero
    if (this.scrollProgress < fadeOutEnd) {
      return 1 - ((this.scrollProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart));
    }

    return 0; // Completely gone when animation ends
  }

  getTextScale(): number {
    // Text scales up from the start of the zoom animation
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;

    // Start smaller and grow throughout the zoom
    const minScale = isSmallMobile ? 0.3 : (isMobile ? 0.4 : 0.5);
    const maxScale = isSmallMobile ? 1.2 : (isMobile ? 1.5 : 1.8);

    // Scale throughout the entire visible range (10-92%)
    const textStartProgress = isMobile ? 0.1 : 0.15;
    const textEndProgress = 0.92;

    if (this.scrollProgress < textStartProgress) return minScale;
    if (this.scrollProgress > textEndProgress) return maxScale;

    const relativeProgress = (this.scrollProgress - textStartProgress) / (textEndProgress - textStartProgress);
    const easedProgress = Math.pow(relativeProgress, 0.6);

    return minScale + (easedProgress * (maxScale - minScale));
  }

  getTextTransform(): string {
    const isMobile = window.innerWidth < 768;

    // Subtle vertical movement throughout the zoom
    const textStartProgress = isMobile ? 0.1 : 0.15;
    const textEndProgress = 0.92;

    const relativeProgress = Math.max(0, Math.min(1,
      (this.scrollProgress - textStartProgress) / (textEndProgress - textStartProgress)
    ));

    const verticalMove = isMobile ? relativeProgress * 10 : -relativeProgress * 20;
    const scale = this.getTextScale();

    return `translate(-50%, calc(-50% + ${verticalMove}px)) scale(${scale})`;
  }
}
