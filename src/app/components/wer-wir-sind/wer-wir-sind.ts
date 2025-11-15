import { Component, HostListener, OnInit, ElementRef, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Debounce } from '../../utils/decorators';

interface Particle {
  x: number;
  y: number;
  floatX: string;
  floatY: string;
  delay: string;
}

@Component({
  selector: 'app-wer-wir-sind',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wer-wir-sind.html',
  styleUrls: ['./wer-wir-sind.css']
})
export class WerWirSindComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() lineExtended = new EventEmitter<boolean>();
  @Output() starReachedPortal = new EventEmitter<void>();

  @ViewChild('sindWord', { read: ElementRef }) sindWord?: ElementRef;
  @ViewChild('titleSection', { read: ElementRef }) titleSection?: ElementRef;

  isAnimated = false;
  activeWordIndex = -1;
  particles: Particle[] = [];
  showStar = false;
  starIsBlue = false;
  starTransform = '';

  private wordTimers: any[] = [];
  private starAnimationFrame: any = null;
  private isAutoScrolling = false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.generateParticles();
    this.checkScrollPosition();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.checkScrollPosition(), 100);
  }

  ngOnDestroy(): void {
    this.clearWordTimers();
    if (this.starAnimationFrame) {
      cancelAnimationFrame(this.starAnimationFrame);
    }
  }

  private generateParticles(): void {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        floatX: `${(Math.random() - 0.5) * 100}px`,
        floatY: `${(Math.random() - 0.5) * 100}px`,
        delay: `${Math.random() * 3}s`
      });
    }
  }

  @HostListener('window:scroll', [])
  @Debounce(16)
  onWindowScroll(): void {
    if (!this.isAutoScrolling) {
      this.checkScrollPosition();
    }
  }

  private checkScrollPosition(): void {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const isVisible = rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.3;
    const isAbove = rect.top > windowHeight * 0.7;

    if (isVisible && !this.isAnimated) {
      this.isAnimated = true;
      this.startWordAnimation();
      this.lineExtended.emit(true);
    } else if (isAbove && this.isAnimated) {
      this.isAnimated = false;
      this.activeWordIndex = -1;
      this.showStar = false;
      this.starIsBlue = false;
      this.clearWordTimers();
      this.lineExtended.emit(false);
    }
  }

  private startWordAnimation(): void {
    this.clearWordTimers();

    // WER becomes blue
    const timer1 = setTimeout(() => {
      this.activeWordIndex = 0;
    }, 0);
    this.wordTimers.push(timer1);

    // WIR becomes blue, WER becomes white
    const timer2 = setTimeout(() => {
      this.activeWordIndex = 1;
    }, 800);
    this.wordTimers.push(timer2);

    // SIND becomes blue, WER and WIR become white
    const timer3 = setTimeout(() => {
      this.activeWordIndex = 2;
      // Star appears and lands on SIND
      this.animateStarToSind();
    }, 1600);
    this.wordTimers.push(timer3);
  }

  private animateStarToSind(): void {
    if (!this.sindWord) return;

    this.showStar = true;
    const sindRect = this.sindWord.nativeElement.getBoundingClientRect();
    const sindCenterX = sindRect.left + sindRect.width / 2;
    const sindCenterY = sindRect.top + sindRect.height / 2;

    // Star falls to SIND
    setTimeout(() => {
      this.starTransform = `translate(-50%, 0) translate(${sindCenterX - window.innerWidth / 2}px, ${sindCenterY}px)`;
    }, 50);

    // Star turns blue
    setTimeout(() => {
      this.starIsBlue = true;
    }, 1100);

    // Star travels to portal and auto-scroll follows
    setTimeout(() => {
      this.animateStarToPortal();
    }, 1800);
  }

  private animateStarToPortal(): void {
    const imageRevealSection = document.querySelector('.portal-reveal-section');
    if (!imageRevealSection) return;

    const portalRect = imageRevealSection.getBoundingClientRect();
    const portalCenterX = portalRect.left + portalRect.width / 2;
    const portalCenterY = portalRect.top + portalRect.height / 2;

    // Calculate the target position for the star
    const targetX = portalCenterX - window.innerWidth / 2;
    const targetY = portalCenterY;

    // Animate star to portal
    this.starTransform = `translate(-50%, 0) translate(${targetX}px, ${targetY}px)`;

    // Auto-scroll to follow the star
    this.isAutoScrolling = true;
    this.smoothScrollToPortal();

    // Emit event when star reaches portal
    setTimeout(() => {
      this.starReachedPortal.emit();
      this.isAutoScrolling = false;
    }, 2000);
  }

  private smoothScrollToPortal(): void {
    const imageRevealSection = document.querySelector('.portal-reveal-section');
    if (!imageRevealSection) return;

    const targetY = imageRevealSection.getBoundingClientRect().top + window.scrollY - window.innerHeight / 3;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 2000; // 2 seconds
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function
      const easeProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + distance * easeProgress);

      if (progress < 1) {
        this.starAnimationFrame = requestAnimationFrame(animation);
      }
    };

    this.starAnimationFrame = requestAnimationFrame(animation);
  }

  private clearWordTimers(): void {
    this.wordTimers.forEach(timer => clearTimeout(timer));
    this.wordTimers = [];
  }
}
