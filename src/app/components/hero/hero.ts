import {Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter, SimpleChanges, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TileDropAnimationComponent } from '../tile-drop-animation/tile-drop-animation';
import { ANIMATION_DURATION } from '../../constants/animation.constants';
import { debugLog } from '../../enviroments/enviroments';

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
  logoAnimationActive = false;
  logoAnimationComplete = false;
  hideFirstSlide = false;

  private slideInterval: ReturnType<typeof setInterval> | null = null;
  private heroContentTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showTileAnimation'] && !this.showTileAnimation) {
      this.showScrollingText = true;
      this.revealText = true;
      this.showHeroContent = true;
      debugLog('Tile animation disabled - showing hero content immediately');
    }
  }

  ngAfterViewInit(): void {
    if (this.activeSlide === 2 && this.showHeroContent) {
      this.triggerBubbleSequence();
    }

    if (!this.showTileAnimation) {
      setTimeout(() => {
        this.tileAnimationComplete.emit();
        debugLog('Tile animation skipped - emitting complete');
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
    if (this.heroContentTimeout) clearTimeout(this.heroContentTimeout);
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      if (this.logoAnimationComplete && this.activeSlide === 0) {
        this.activeSlide = 1;
      }

      if (this.activeSlide === 2) return;

      const nextSlide = (this.activeSlide + 1) % 3;

      if (this.logoAnimationComplete && nextSlide === 0) {
        this.activeSlide = 1;
      } else {
        this.activeSlide = nextSlide;
      }

      if (this.activeSlide === 2 && this.showHeroContent) {
        this.triggerBubbleSequence();
      }
    }, ANIMATION_DURATION.HERO_SLIDE);
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
    this.logoAnimationActive = false;
    this.logoAnimationComplete = false;
    this.hideFirstSlide = false;
    this.activeSlide = 0;

    if (this.heroContentTimeout) {
      clearTimeout(this.heroContentTimeout);
      this.heroContentTimeout = null;
    }

    if (this.slideInterval) clearInterval(this.slideInterval);
    this.startAutoSlide();
  }

  onDiscoverClick(): void {
    if (this.logoAnimationActive || this.logoAnimationComplete) return;

    if (this.slideInterval) clearInterval(this.slideInterval);
    this.activeSlide = 0;
    this.logoAnimationActive = true;

    setTimeout(() => this.triggerLogoAnimation(), 500);
  }

  triggerLogoAnimation(): void {
    const prestigioText = document.querySelector('.prestigio-text') as HTMLElement;
    const softwareText = document.querySelector('.software-text') as HTMLElement;

    if (!prestigioText || !softwareText) return;

    prestigioText.classList.add('logo-animation-active');
    softwareText.classList.add('fly-out');

    setTimeout(() => {
      this.logoAnimationComplete = true;
      this.logoAnimationActive = false;
      this.hideFirstSlide = true;

      this.activeSlide = 1;
      this.startAutoSlide();
    }, 3500);
  }

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

    setTimeout(() => {
      this.activeSlide = this.logoAnimationComplete ? 1 : 0;
      if (this.slideInterval) clearInterval(this.slideInterval);
      this.startAutoSlide();
    }, delay + 2000);
  }
}
