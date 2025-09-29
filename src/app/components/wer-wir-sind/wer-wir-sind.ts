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

  isAnimated = false;
  isMobile = false;

  // 3 lines positioned to kiss the edges and go through middle
  lines: any[] = [
    { position: '22%', highlight: false },    // Kiss the left edge of "WER"
    { position: '50%', highlight: true },     // Through the middle of "WIR" - extends to image
    { position: '78%', highlight: false }     // Kiss the right edge of "SIND"
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
      this.lineExtended.emit(true);
    } else if (!isVisible && this.isAnimated) {
      // Reset animation when scrolling away
      this.isAnimated = false;
      this.resetAnimation();
      this.lineExtended.emit(false);
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
    // For desktop, just make WIR blue when the middle line extends
    const wirText = this.elementRef.nativeElement.querySelector('.highlight-text');

    setTimeout(() => {
      if (wirText) {
        wirText.classList.add('line-active');
      }
    }, 1000); // Delay to match line extension
  }

  private startMobileSequentialAnimation(): void {
    const textSections = this.elementRef.nativeElement.querySelectorAll('.portfolio-heading');

    // Reset all text colors
    textSections.forEach((heading: HTMLElement) => {
      heading.classList.remove('line-active');
    });

    // Sequential text coloring based on faster line movement (4s total)
    setTimeout(() => {
      textSections[0].classList.add('line-active'); // WER turns blue
    }, 500);

    setTimeout(() => {
      textSections[0].classList.remove('line-active'); // WER back to white
      textSections[1].classList.add('line-active'); // WIR turns blue
    }, 2000);

    setTimeout(() => {
      textSections[1].classList.remove('line-active'); // WIR back to white
      textSections[2].classList.add('line-active'); // SIND turns blue
    }, 3500);
  }

  private resetAnimation(): void {
    const container = this.elementRef.nativeElement.querySelector('.container');
    const textHeadings = this.elementRef.nativeElement.querySelectorAll('.portfolio-heading');

    if (container) {
      container.classList.remove('animate-lines');
    }

    // Reset all text colors
    textHeadings.forEach((heading: HTMLElement) => {
      heading.classList.remove('line-active');
    });
  }
}
