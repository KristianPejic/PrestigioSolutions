import { Component, HostListener, OnInit, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wer-wir-sind',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wer-wir-sind.html',
  styleUrls: ['./wer-wir-sind.css']
})
export class WerWirSindComponent implements OnInit, AfterViewInit {
  @Output() lineExtended = new EventEmitter<boolean>();
  @Output() leftLineExtended = new EventEmitter<boolean>();
  @Output() rightLineExtended = new EventEmitter<boolean>();

  isAnimated = false;
  isMobile = false;

  // Lines positioned as simple percentages initially
  lines: any[] = [
    { position: '25%', highlight: false },    // Left line (WER)
    { position: '50%', highlight: true },     // Center line (WIR)
    { position: '75%', highlight: false }     // Right line (SIND)
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.checkScrollPosition();
  }

  ngAfterViewInit(): void {
    // Wait for full render, then calculate positions
    setTimeout(() => {
      this.calculateLinePositions();
    }, 300);

    // Check scroll after positioning
    setTimeout(() => {
      this.checkScrollPosition();
    }, 400);
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
    // Recalculate on resize with debounce
    setTimeout(() => {
      this.calculateLinePositions();
    }, 150);
  }

  private calculateLinePositions(): void {
    if (this.isMobile) {
      // On mobile, only one center line
      this.lines = [
        { position: '50%', highlight: true }
      ];
      return;
    }

    // Get text elements
    const werElement = this.elementRef.nativeElement.querySelector('.text-left');
    const wirElement = this.elementRef.nativeElement.querySelector('.text-center');
    const sindElement = this.elementRef.nativeElement.querySelector('.text-right');
    const container = this.elementRef.nativeElement.querySelector('.container');

    if (!werElement || !wirElement || !sindElement || !container) {
      console.error('❌ Elements not found');
      // Fallback positions
      this.lines = [
        { position: '25%', highlight: false },
        { position: '50%', highlight: true },
        { position: '75%', highlight: false }
      ];
      return;
    }

    try {
      const containerRect = container.getBoundingClientRect();
      const containerLeft = containerRect.left;
      const containerWidth = containerRect.width;

      // Get center of each text section
      const werRect = werElement.getBoundingClientRect();
      const wirRect = wirElement.getBoundingClientRect();
      const sindRect = sindElement.getBoundingClientRect();

      const werCenter = werRect.left + (werRect.width / 2) - containerLeft;
      const wirCenter = wirRect.left + (wirRect.width / 2) - containerLeft;
      const sindCenter = sindRect.left + (sindRect.width / 2) - containerLeft;

      // Convert to pixels (not percentages) for more precision
      this.lines = [
        { position: `${werCenter}px`, highlight: false },
        { position: `${wirCenter}px`, highlight: true },
        { position: `${sindCenter}px`, highlight: false }
      ];

      console.log('✅ Lines positioned:');
      console.log(`WER: ${werCenter.toFixed(0)}px`);
      console.log(`WIR: ${wirCenter.toFixed(0)}px`);
      console.log(`SIND: ${sindCenter.toFixed(0)}px`);
      console.log(`Container width: ${containerWidth}px`);

    } catch (error) {
      console.error('❌ Error calculating positions:', error);
      // Fallback
      this.lines = [
        { position: '25%', highlight: false },
        { position: '50%', highlight: true },
        { position: '75%', highlight: false }
      ];
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private checkScrollPosition(): void {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const hasPassed = rect.bottom < windowHeight * 0.3;
    const isVisible = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;
    const isAbove = rect.top > windowHeight * 0.7;

    if (isVisible && !this.isAnimated) {
      this.isAnimated = true;
      this.triggerAnimation();
      this.lineExtended.emit(true);
    } else if (hasPassed && this.isAnimated) {
      // Keep animation active when scrolled past
    } else if (isAbove && this.isAnimated) {
      this.isAnimated = false;
      this.resetAnimation();
      this.lineExtended.emit(false);
      this.leftLineExtended.emit(false);
      this.rightLineExtended.emit(false);
    }
  }

  private triggerAnimation(): void {
    const container = this.elementRef.nativeElement.querySelector('.container');
    if (container) {
      container.classList.add('animate-lines');

      if (this.isMobile) {
        this.startMobileSequentialAnimation();
      } else {
        this.startDesktopAnimation();
      }
    }
  }

  private startDesktopAnimation(): void {
    const wirText = this.elementRef.nativeElement.querySelector('.highlight-text');

    // WIR turns blue when middle line passes through
    setTimeout(() => {
      if (wirText) {
        wirText.classList.add('line-active');
      }
    }, 1000);

    // Emit events when left and right lines reach the text
    setTimeout(() => {
      this.leftLineExtended.emit(true);
    }, 1000);

    setTimeout(() => {
      this.rightLineExtended.emit(true);
    }, 1000);
  }

  private startMobileSequentialAnimation(): void {
    const textSections = this.elementRef.nativeElement.querySelectorAll('.portfolio-heading');

    textSections.forEach((heading: HTMLElement) => {
      heading.classList.remove('line-active');
    });

    // WER turns blue
    setTimeout(() => {
      textSections[0].classList.add('line-active');
    }, 500);

    // WIR turns blue
    setTimeout(() => {
      textSections[0].classList.remove('line-active');
      textSections[1].classList.add('line-active');
    }, 2000);

    // SIND turns blue
    setTimeout(() => {
      textSections[1].classList.remove('line-active');
      textSections[2].classList.add('line-active');
    }, 3500);
  }

  private resetAnimation(): void {
    const container = this.elementRef.nativeElement.querySelector('.container');
    const textHeadings = this.elementRef.nativeElement.querySelectorAll('.portfolio-heading');

    if (container) {
      container.classList.remove('animate-lines');
    }

    textHeadings.forEach((heading: HTMLElement) => {
      heading.classList.remove('line-active');
    });
  }
}
