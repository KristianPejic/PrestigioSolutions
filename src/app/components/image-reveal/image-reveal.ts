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
    if (changes['isLineExtended']) {
      if (this.isLineExtended && !this.isLoading && !this.isRevealed) {
        this.animationTimeout = setTimeout(() => {
          this.startLoadingAnimation();
        }, 2000);
      } else if (!this.isLineExtended) {
        if (this.animationTimeout) clearTimeout(this.animationTimeout);
        if (this.layoutTimeout) clearTimeout(this.layoutTimeout);
        this.isLoading = false;
        this.isRevealed = false;
        this.isLayoutTransformed = false;
        this.cdr.detectChanges();
      }
    }
  }

  private startLoadingAnimation(): void {
    if (this.isLoading || this.isRevealed) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isLoading = false;
      this.isRevealed = true;
      this.imageRevealed.emit();
      this.cdr.detectChanges();

      this.layoutTimeout = setTimeout(() => {
        this.isLayoutTransformed = true;
        this.layoutTransformed.emit();
        this.cdr.detectChanges();
      }, 1500);
    }, 1800);
  }

  ngOnDestroy(): void {
    if (this.animationTimeout) clearTimeout(this.animationTimeout);
    if (this.layoutTimeout) clearTimeout(this.layoutTimeout);
  }
}
