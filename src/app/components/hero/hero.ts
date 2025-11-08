import {Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter, SimpleChanges, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TileDropAnimationComponent } from '../tile-drop-animation/tile-drop-animation';
import { MagicHatAnimation } from '../magic-hat-animation/magic-hat-animation';
import { ANIMATION_DURATION } from '../../constants/animation.constants';
import { debugLog } from '../../enviroments/enviroments';
// SessionService import commented out for testing
// import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TileDropAnimationComponent, MagicHatAnimation],
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

  // Magic hat properties
  showMagicHat = false;
  showDiscoverButton = true;
  hatRotating = false;
  // Session storage commented out for testing
  // private readonly MAGIC_HAT_SESSION_KEY = 'hasSeenMagicHat';

  private slideInterval: ReturnType<typeof setInterval> | null = null;
  private heroContentTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    // SessionService commented out for testing
    // private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.startAutoSlide();
    // Session storage check commented out for testing
    // this.checkMagicHatSession();
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

  // Session storage check commented out for testing
  /*
  private checkMagicHatSession(): void {
    const hasSeenMagicHat = this.sessionService.getItem(this.MAGIC_HAT_SESSION_KEY);
    if (hasSeenMagicHat === 'true') {
      this.showDiscoverButton = false;
      debugLog('Magic hat already seen this session - hiding discover button');
    }
  }
  */

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      if (this.activeSlide === 2) return;

      const nextSlide = (this.activeSlide + 1) % 3;
      this.activeSlide = nextSlide;

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
    this.activeSlide = 0;

    if (this.heroContentTimeout) {
      clearTimeout(this.heroContentTimeout);
      this.heroContentTimeout = null;
    }

    if (this.slideInterval) clearInterval(this.slideInterval);
    this.startAutoSlide();
  }

  onDiscoverClick(): void {
    if (this.showMagicHat) return;

    // Show magic hat immediately - no transition
    this.showMagicHat = true;
    this.showDiscoverButton = false;

    // Rotate hat immediately
    setTimeout(() => {
      this.hatRotating = true;
    }, 100);

    // Session storage commented out for testing
    // this.sessionService.setItem(this.MAGIC_HAT_SESSION_KEY, 'true');

    debugLog('🎩 Magic hat animation triggered!');
  }

  onMagicHatComplete(): void {
    this.showMagicHat = false;
    this.hatRotating = false;
    debugLog('🎩 Magic hat animation complete');
  }

  // Logo animation removed for now
  /*
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
  */

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
      this.activeSlide = 0;
      if (this.slideInterval) clearInterval(this.slideInterval);
      this.startAutoSlide();
    }, delay + 2000);
  }
}
