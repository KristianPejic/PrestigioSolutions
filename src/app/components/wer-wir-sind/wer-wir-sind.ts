import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wer-wir-sind',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wer-wir-sind.html',
  styleUrls: ['./wer-wir-sind.css']
})
export class WerWirSindComponent implements OnInit {
  isAnimated = false;
  isMobile = false;

  // 3 lines positioned to kiss the edges and go through middle
  lines: any[] = [
    { position: '19%', highlight: false },    // Kiss the left edge of "WER"
    { position: '50%', highlight: true },     // Through the middle of "WIR"
    { position: '83.2%', highlight: false }  // Kiss the right edge of "SIND"
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

    // Trigger animation when element is 50% visible
    const isVisible = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;

    if (isVisible && !this.isAnimated) {
      this.isAnimated = true;
      this.triggerAnimation();
    } else if (!isVisible && this.isAnimated) {
      // Reset animation when scrolling away
      this.isAnimated = false;
      this.resetAnimation();
    }
  }

  private triggerAnimation(): void {
    const container = this.elementRef.nativeElement.querySelector('.container');
    if (container) {
      container.classList.add('animate-lines');

      if (this.isMobile) {
        this.startMobileSequentialAnimation();
      }
    }
  }

  private startMobileSequentialAnimation(): void {
    const textSections = this.elementRef.nativeElement.querySelectorAll('.text-section');

    // Reset all word states
    textSections.forEach((section: HTMLElement) => {
      section.classList.remove('word-hit');
    });

    // Sequential word hitting with circling animation
    setTimeout(() => {
      // Hit WER - when persistent line reaches WER position
      textSections[0].classList.add('word-hit');

      // Remove after circling animation completes
      setTimeout(() => {
        textSections[0].classList.remove('word-hit');
      }, 2000);
    }, 1000); // 12.5% of 8s animation

    setTimeout(() => {
      // Hit WIR - when persistent line reaches WIR position
      textSections[1].classList.add('word-hit');

      // Remove after circling animation completes
      setTimeout(() => {
        textSections[1].classList.remove('word-hit');
      }, 2000);
    }, 4000); // 50% of 8s animation

    setTimeout(() => {
      // Hit SIND - when persistent line reaches SIND position
      textSections[2].classList.add('word-hit');

      // Remove after circling animation completes
      setTimeout(() => {
        textSections[2].classList.remove('word-hit');
      }, 2000);
    }, 7000); // 87.5% of 8s animation
  }

  private resetAnimation(): void {
    const container = this.elementRef.nativeElement.querySelector('.container');
    const textSections = this.elementRef.nativeElement.querySelectorAll('.text-section');

    if (container) {
      container.classList.remove('animate-lines');
    }

    // Reset all word states
    textSections.forEach((section: HTMLElement) => {
      section.classList.remove('word-hit');
    });
  }
}
