import { Component, HostListener, OnInit, ElementRef, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeService } from '../../services/resize.service';
import { Debounce } from '../../utils/decorators';
import { Subscription } from 'rxjs';
import { debugLog } from '../../enviroments/enviroments';

interface Line {
  position: string;
  highlight: boolean;
}

@Component({
  selector: 'app-wer-wir-sind',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wer-wir-sind.html',
  styleUrls: ['./wer-wir-sind.css']
})
export class WerWirSindComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() lineExtended = new EventEmitter<boolean>();
  @Output() leftLineExtended = new EventEmitter<boolean>();
  @Output() rightLineExtended = new EventEmitter<boolean>();

  isAnimated = false;
  isMobile = false;

  lines: Line[] = [
    { position: '25%', highlight: false },
    { position: '50%', highlight: true },
    { position: '75%', highlight: false }
  ];

  private resizeSubscription?: Subscription;

  constructor(
    private elementRef: ElementRef,
    private resizeService: ResizeService
  ) {}

  ngOnInit(): void {
    this.isMobile = this.resizeService.isMobile();
    this.checkScrollPosition();

    this.resizeSubscription = this.resizeService.resize$.subscribe(screenSize => {
      this.isMobile = screenSize.isMobile;
      this.calculateLinePositions();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calculateLinePositions();
    }, 300);

    setTimeout(() => {
      this.checkScrollPosition();
    }, 400);
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe();
  }

  @HostListener('window:scroll', [])
  @Debounce(16)
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  private calculateLinePositions(): void {
    if (this.isMobile) {
      this.lines = [
        { position: '50%', highlight: true }
      ];
      return;
    }

    const werElement = this.elementRef.nativeElement.querySelector('.text-left');
    const wirElement = this.elementRef.nativeElement.querySelector('.text-center');
    const sindElement = this.elementRef.nativeElement.querySelector('.text-right');
    const container = this.elementRef.nativeElement.querySelector('.container');

    if (!werElement || !wirElement || !sindElement || !container) {
      debugLog('❌ Elements not found');
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

      const werRect = werElement.getBoundingClientRect();
      const wirRect = wirElement.getBoundingClientRect();
      const sindRect = sindElement.getBoundingClientRect();

      const werCenter = werRect.left + (werRect.width / 2) - containerLeft;
      const wirCenter = wirRect.left + (wirRect.width / 2) - containerLeft;
      const sindCenter = sindRect.left + (sindRect.width / 2) - containerLeft;

      this.lines = [
        { position: `${werCenter}px`, highlight: false },
        { position: `${wirCenter}px`, highlight: true },
        { position: `${sindCenter}px`, highlight: false }
      ];

      debugLog('✅ Lines positioned:');
      debugLog(`WER: ${werCenter.toFixed(0)}px`);
      debugLog(`WIR: ${wirCenter.toFixed(0)}px`);
      debugLog(`SIND: ${sindCenter.toFixed(0)}px`);
      debugLog(`Container width: ${containerWidth}px`);

    } catch (error) {
      debugLog('❌ Error calculating positions:', error);
      this.lines = [
        { position: '25%', highlight: false },
        { position: '50%', highlight: true },
        { position: '75%', highlight: false }
      ];
    }
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

    setTimeout(() => {
      if (wirText) {
        wirText.classList.add('line-active');
      }
    }, 1000);

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

    setTimeout(() => {
      textSections[0].classList.add('line-active');
    }, 500);

    setTimeout(() => {
      textSections[0].classList.remove('line-active');
      textSections[1].classList.add('line-active');
    }, 2000);

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
