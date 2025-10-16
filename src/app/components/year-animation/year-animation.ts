import { Component, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollProgressService } from '../../services/scroll-progress.service';
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
    private scrollProgressService: ScrollProgressService,
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

  /**
   * Generate particles for the animation inside the "0"
   */
  private generateParticles(): void {
    const particleCount = 50; // Number of particles

    for (let i = 0; i < particleCount; i++) {
      // Random position around center (50%, 50%)
      const angle = (Math.PI * 2 * i) / particleCount;
      const radius = Math.random() * 15 + 35; // 35-50% from center

      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;

      // Random offsets for animation
      const xOffset = (Math.random() - 0.5) * 200;
      const yOffset = (Math.random() - 0.5) * 200;

      const particle: Particle = {
        x: x,
        y: y,
        size: Math.random() * 6 + 3, // 3-9px
        delay: Math.random() * 2, // 0-2s delay
        duration: Math.random() * 2 + 3, // 3-5s duration
        xOffset: xOffset,
        yOffset: yOffset
      };

      this.particles.push(particle);
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

    // Apply CSS variables for particle animation
    this.applyParticleOffsets();
  }

  /**
   * Apply random offsets to particles as CSS variables
   */
  private applyParticleOffsets(): void {
    const particleElements = this.elementRef.nativeElement.querySelectorAll('.particle');
    particleElements.forEach((el: HTMLElement, index: number) => {
      if (this.particles[index]) {
        el.style.setProperty('--x-offset', `${this.particles[index].xOffset}px`);
        el.style.setProperty('--y-offset', `${this.particles[index].yOffset}px`);
      }
    });
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

  /**
   * Particle opacity - fade in as zoom increases
   */
  getParticleOpacity(): number {
    if (this.scrollProgress < 0.2) {
      return 0;
    }
    if (this.scrollProgress < 0.4) {
      return (this.scrollProgress - 0.2) / 0.2;
    }
    if (this.scrollProgress < 0.7) {
      return 1;
    }
    return 1 - ((this.scrollProgress - 0.7) / 0.3);
  }

  /**
   * Ring opacity - fade in with particles
   */
  getRingOpacity(): number {
    if (this.scrollProgress < 0.25) {
      return 0;
    }
    if (this.scrollProgress < 0.45) {
      return (this.scrollProgress - 0.25) / 0.2;
    }
    if (this.scrollProgress < 0.65) {
      return 1;
    }
    return 1 - ((this.scrollProgress - 0.65) / 0.35);
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
