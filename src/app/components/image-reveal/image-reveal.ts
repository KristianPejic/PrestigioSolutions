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

  @Output() imageRevealed = new EventEmitter<void>();

  isLoading = false;
  isRevealed = false;
  private animationTimeout: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ImageReveal - isLineExtended changed:', this.isLineExtended);

    // When line extends and connects to image, automatically start animation
    if (changes['isLineExtended']) {
      if (this.isLineExtended && !this.isLoading && !this.isRevealed) {
        console.log('ImageReveal - Line extended, starting animation after 2s delay');
        // Wait for line animation to complete (2s) then start loading
        this.animationTimeout = setTimeout(() => {
          console.log('ImageReveal - Starting loading animation NOW');
          this.startLoadingAnimation();
        }, 2000);
      } else if (!this.isLineExtended) {
        // Line retracted - reset everything
        console.log('ImageReveal - Line retracted, resetting');
        if (this.animationTimeout) {
          clearTimeout(this.animationTimeout);
        }
        this.isLoading = false;
        this.isRevealed = false;
        this.cdr.detectChanges();
      }
    }
  }

  onImageClick(): void {
    // Manual click disabled - animation auto-starts when line connects
    return;
  }

  private startLoadingAnimation(): void {
    if (this.isLoading || this.isRevealed) {
      console.log('ImageReveal - Animation already running or complete');
      return;
    }

    console.log('ImageReveal - Loading animation STARTED');
    this.isLoading = true;
    this.cdr.detectChanges();

    // Loading animation duration: 1.8s (4 sides at 0.3s each + spinner fade) - MUCH FASTER
    setTimeout(() => {
      console.log('ImageReveal - Loading complete, revealing image');
      this.isLoading = false;
      this.isRevealed = true;
      this.imageRevealed.emit();
      this.cdr.detectChanges();
    }, 1800);
  }

  ngOnDestroy(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }
}
