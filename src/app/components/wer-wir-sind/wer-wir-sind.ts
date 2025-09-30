import { Component, HostListener, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wer-wir-sind',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wer-wir-sind.html',
  styleUrls: ['./wer-wir-sind.css']
})
export class WerWirSindComponent implements OnInit {
  @Output() lineExtended = new EventEmitter<boolean>();
  @Output() leftLineExtended = new EventEmitter<boolean>();
  @Output() rightLineExtended = new EventEmitter<boolean>();

  isAnimated = false;
  isMobile = false;

  // 3 lines positioned strategically
  lines: any[] = [
    { position: '22%', highlight: false },    // Left line (WER)
    { position: '50%', highlight: true },     // Center line (WIR) - extends to image
    { position: '78%', highlight: false }     // Right line (SIND)
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.checkScrollPosition();
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
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

    setTimeout(() => {
      if (wirText) {
        wirText.classList.add('line-active');
      }
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
