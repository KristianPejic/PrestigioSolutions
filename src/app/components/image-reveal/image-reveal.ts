import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Debounce } from '../../utils/decorators';

interface Particle {
  x: number;
  y: number;
  floatX: string;
  floatY: string;
  delay: string;
}

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

  isPortalActive = false;
  isImageActive = false;
  isContentActive = false;
  particles: Particle[] = [];

  private animationTimeout: any = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.generateParticles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLineExtended']) {
      if (this.isLineExtended) {
        this.startPortalAnimation();
      } else {
        this.resetPortalAnimation();
      }
    }
  }

  @HostListener('window:scroll', [])
  @Debounce(16)
  onWindowScroll(): void {
    if (this.isLineExtended) {
      this.checkScrollPosition();
    }
  }

  private generateParticles(): void {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        floatX: `${(Math.random() - 0.5) * 100}px`,
        floatY: `${(Math.random() - 0.5) * 100}px`,
        delay: `${Math.random() * 3}s`
      });
    }
  }

  private checkScrollPosition(): void {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const isVisible = rect.top < windowHeight * 0.6;

    if (isVisible && !this.isPortalActive) {
      this.startPortalAnimation();
    }
  }

  private startPortalAnimation(): void {
    if (this.isPortalActive) return;

    // Clear any existing timeout
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    // Start portal ring and rotating lines
    this.animationTimeout = setTimeout(() => {
      this.isPortalActive = true;
    }, 100);

    // Reveal image
    this.animationTimeout = setTimeout(() => {
      this.isImageActive = true;
      this.imageRevealed.emit();
    }, 700);

    // Show content card
    this.animationTimeout = setTimeout(() => {
      this.isContentActive = true;
      this.layoutTransformed.emit();
    }, 1200);
  }

  private resetPortalAnimation(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    this.isPortalActive = false;
    this.isImageActive = false;
    this.isContentActive = false;
  }

  ngOnDestroy(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }
}
