import {Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter, SimpleChanges, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TileDropAnimationComponent } from '../tile-drop-animation/tile-drop-animation';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TileDropAnimationComponent],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() showTileAnimation = true;
  @Output() tileAnimationComplete = new EventEmitter<void>();

  showScrollingText = false;
  revealText = false;
  showHeroContent = false;
  activeSlide = 0;

  private slideInterval: any;
  private heroContentTimeout: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // If tile animation is disabled, show content immediately
    if (changes['showTileAnimation'] && !this.showTileAnimation) {
      this.showScrollingText = true;
      this.revealText = true;
      this.showHeroContent = true;
      console.log('Tile animation disabled - showing hero content immediately');
    }
  }

  ngAfterViewInit(): void {
    if (this.activeSlide === 2 && this.showHeroContent) {
      this.triggerBubbleSequence();
    }

    // If tile animation is disabled, emit complete immediately
    if (!this.showTileAnimation) {
      setTimeout(() => {
        this.tileAnimationComplete.emit();
        console.log('Tile animation skipped - emitting complete');
      }, 100);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
    if (this.heroContentTimeout) clearTimeout(this.heroContentTimeout);
  }

  /** Auto-slide logic: slides 0 and 1 every 5s, slide 2 waits for animation */
  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      if (this.activeSlide === 2) return; // slide 3 handled separately

      this.activeSlide = (this.activeSlide + 1) % 3;

      if (this.activeSlide === 2 && this.showHeroContent) {
        this.triggerBubbleSequence();
      }
    }, 5000);
  }

  onFirstWaveComplete(): void {
    this.showScrollingText = true;

    this.heroContentTimeout = setTimeout(() => {
      this.showHeroContent = true;
      if (this.activeSlide === 2) this.triggerBubbleSequence();
    }, 1500);
  }

  onTileAnimationComplete(): void {
    this.revealText = true;
    if (!this.showHeroContent) {
      this.showHeroContent = true;
      if (this.activeSlide === 2) this.triggerBubbleSequence();
    }

    this.tileAnimationComplete.emit();
  }

  onHeroReset(): void {
    this.showScrollingText = false;
    this.revealText = false;
    this.showHeroContent = false;

    if (this.heroContentTimeout) {
      clearTimeout(this.heroContentTimeout);
      this.heroContentTimeout = null;
    }
  }

  onDiscoverClick(): void {
    console.log('Jetzt entdecken clicked!');
  }

  /** Bubble sequence animation for slide 3 */
  triggerBubbleSequence(): void {
    const bubbles = document.querySelectorAll('.bubble');
    const lines = document.querySelectorAll('.line');
    let delay = 300;

    bubbles.forEach((bubble, i) => {
      const number = bubble.querySelector('.bubble-number') as HTMLElement;
      const circle = bubble.querySelector('circle') as SVGCircleElement;
      const text = bubble.querySelector('.bubble-text') as HTMLElement;
      const line = lines[i] as HTMLElement;

      bubble.classList.remove('show-bubble');
      number.classList.remove('show-number');
      text.classList.remove('show-text');
      circle?.classList.remove('draw-circle');
      line?.classList.remove('show-line');

      setTimeout(() => bubble.classList.add('show-bubble'), delay);
      setTimeout(() => number.classList.add('show-number'), delay + 500);
      setTimeout(() => circle?.classList.add('draw-circle'), delay + 1000);
      setTimeout(() => text.classList.add('show-text'), delay + 2200);
      if (line) setTimeout(() => line.classList.add('show-line'), delay + 2800);

      delay += 2500;
    });

    // After last bubble finishes, wait, then go back to slide 0
    setTimeout(() => {
      this.activeSlide = 0;

      //  Restart auto-slide fresh so slide 1 also lasts full 5s again
      clearInterval(this.slideInterval);
      this.startAutoSlide();
    }, delay + 2000); // pause after last bubble
  }
}
