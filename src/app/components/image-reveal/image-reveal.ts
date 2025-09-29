import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
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

  ngOnChanges(changes: SimpleChanges): void {
    // When line extends and connects to image, automatically start animation
    if (changes['isLineExtended']) {
      if (this.isLineExtended && !this.isLoading && !this.isRevealed) {
        // Wait for line animation to complete (1.5s) then start loading animation
        this.animationTimeout = setTimeout(() => {
          this.startLoadingAnimation();
        }, 1500);
      } else if (!this.isLineExtended) {
        // Line retracted - reset everything
        if (this.animationTimeout) {
          clearTimeout(this.animationTimeout);
        }
        this.isLoading = false;
        this.isRevealed = false;
      }
    }
  }

  onImageClick(): void {
    // Manual click disabled - animation auto-starts when line connects
    return;
  }

  private startLoadingAnimation(): void {
    if (this.isLoading || this.isRevealed) return;

    this.isLoading = true;

    // Loading animation duration: 3s (4 sides at 0.6s each + spinner fade)
    setTimeout(() => {
      this.isLoading = false;
      this.isRevealed = true;
      this.imageRevealed.emit();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }
}
