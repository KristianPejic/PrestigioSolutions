import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Debounce } from '../../utils/decorators';

@Component({
  selector: 'app-image-reveal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-reveal.html',
  styleUrls: ['./image-reveal.css']
})
export class ImageRevealComponent implements OnInit, OnChanges, OnDestroy {
  @Input() imageSrc: string = 'assets/images/reveal-image.jpg';
  @Input() imageAlt: string = 'Reveal Image';
  @Input() isLineExtended: boolean = false;

  @Output() imageRevealed = new EventEmitter<void>();
  @Output() layoutTransformed = new EventEmitter<void>();

  isDrawingActive = false;
  isImageActive = false;
  isContentActive = false;

  private animationTimeout: any = null;
  private hasAnimated = false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    setTimeout(() => this.checkScrollPosition(), 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLineExtended']) {
      if (this.isLineExtended && !this.hasAnimated) {
        this.checkScrollPosition();
      }
    }
  }

  @HostListener('window:scroll', [])
  @Debounce(16)
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    if (this.hasAnimated) return;

    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const isVisible = rect.top < windowHeight * 0.6 && rect.bottom > 0;

    if (isVisible && !this.isDrawingActive) {
      this.startDrawingAnimation();
      this.hasAnimated = true;
    }
  }

  private startDrawingAnimation(): void {
    if (this.isDrawingActive) return;

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    this.animationTimeout = setTimeout(() => {
      this.isDrawingActive = true;
    }, 100);

    this.animationTimeout = setTimeout(() => {
      this.isImageActive = true;
      this.imageRevealed.emit();
    }, 3500);

    this.animationTimeout = setTimeout(() => {
      this.isContentActive = true;
      this.layoutTransformed.emit();
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }
}
