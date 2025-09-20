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

  // 3 lines positioned asymmetrically to frame the actual text bounds
  lines: any[] = [
    { position: '20%', highlight: false },  // Left side of W in "WER"
    { position: '50%', highlight: true },   // Through the middle of "WIR"
    { position: '80.75%', highlight: false }   // Right side of D in "SIND" (moved further right)
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.checkScrollPosition();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScrollPosition();
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
    }
  }

  private resetAnimation(): void {
    const container = this.elementRef.nativeElement.querySelector('.container');
    if (container) {
      container.classList.remove('animate-lines');
    }
  }
}
