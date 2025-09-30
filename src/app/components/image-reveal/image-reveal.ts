import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-reveal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-reveal.html',
  styleUrls: ['./image-reveal.css']
})
export class ImageRevealComponent implements OnChanges, OnDestroy {
  @Input() imageSrc: string = 'assets/images/reveal-image.jpg';
  @Input() imageAlt: string = 'Reveal Image';
  @Input() isLineExtended: boolean = false;
  @Input() leftLineConnected: boolean = false;
  @Input() rightLineConnected: boolean = false;

  @Output() imageRevealed = new EventEmitter<void>();
  @Output() layoutTransformed = new EventEmitter<void>();

  isLoading = false;
  isRevealed = false;
  isLayoutTransformed = false;
  private animationTimeout: any;
  private layoutTimeout: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ImageReveal - isLineExtended changed:', this.isLineExtended);

    if (changes['isLineExtended']) {
      if (this.isLineExtended && !this.isLoading && !this.isRevealed) {
        console.log('ImageReveal - Line extended, starting animation after 2s delay');
        this.animationTimeout = setTimeout(() => {
          console.log('ImageReveal - Starting loading animation NOW');
          this.startLoadingAnimation();
        }, 2000);
      } else if (!this.isLineExtended) {
        console.log('ImageReveal - Line retracted, resetting');
        if (this.animationTimeout) {
          clearTimeout(this.animationTimeout);
        }
        if (this.layoutTimeout) {
          clearTimeout(this.layoutTimeout);
        }
        this.isLoading = false;
        this.isRevealed = false;
        this.isLayoutTransformed = false;
        this.cdr.detectChanges();
      }
    }
  }

  private startLoadingAnimation(): void {
    if (this.isLoading || this.isRevealed) {
      console.log('ImageReveal - Animation already running or complete');
      return;
    }

    console.log('ImageReveal - Loading animation STARTED');
    this.isLoading = true;
    this.cdr.detectChanges();

    // Loading animation duration: 1.8s
    setTimeout(() => {
      console.log('ImageReveal - Loading complete, revealing image');
      this.isLoading = false;
      this.isRevealed = true;
      this.imageRevealed.emit();
      this.cdr.detectChanges();

      // Transform layout after 1.5s delay
      this.layoutTimeout = setTimeout(() => {
        console.log('ImageReveal - Transforming layout');
        this.isLayoutTransformed = true;
        this.layoutTransformed.emit();
        this.cdr.detectChanges();
      }, 1500);
    }, 1800);
  }

  ngOnDestroy(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    if (this.layoutTimeout) {
      clearTimeout(this.layoutTimeout);
    }
  }
}
