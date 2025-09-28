import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TileDropAnimationComponent } from '../tile-drop-animation/tile-drop-animation';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TileDropAnimationComponent, NavbarComponent],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  showScrollingText = false;
  showNavbar = false;
  revealText = false;
  showHeroContent = false;
  activeSlide = 0;

  private slideInterval: any;
  private heroContentTimeout: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngAfterViewInit(): void {
    if (this.activeSlide === 2 && this.showHeroContent) {
      this.triggerBubbleSequence();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
    if (this.heroContentTimeout) clearTimeout(this.heroContentTimeout);
  }

  /** Auto-slide logic: slides 0 and 1 every 5s, slide 2 waits for animation */
  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      // If currently on slide 2, do nothing (handled separately)
      if (this.activeSlide === 2) return;

      this.activeSlide = (this.activeSlide + 1) % 3;

      // Trigger bubble animation if moving to slide 2
      if (this.activeSlide === 2 && this.showHeroContent) {
        this.triggerBubbleSequence();
      }
    }, 5000);
  }

  onFirstWaveComplete(): void {
    this.showScrollingText = true;
    this.showNavbar = true;

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
  }

  onHeroReset(): void {
    this.showScrollingText = false;
    this.showNavbar = false;
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

      // Reset classes for animation
      bubble.classList.remove('show-bubble');
      number.classList.remove('show-number');
      text.classList.remove('show-text');
      circle?.classList.remove('draw-circle');
      line?.classList.remove('show-line');

      // Animate bubble sequence
      setTimeout(() => bubble.classList.add('show-bubble'), delay);
      setTimeout(() => number.classList.add('show-number'), delay + 500);
      setTimeout(() => circle?.classList.add('draw-circle'), delay + 1000);
      setTimeout(() => text.classList.add('show-text'), delay + 2200);
      if (line) setTimeout(() => line.classList.add('show-line'), delay + 2800);

      delay += 2500; // stagger each bubble
    });

    // Move to next slide after last bubble animation finishes
    setTimeout(() => {
      this.activeSlide = (this.activeSlide + 1) % 3;
    }, delay + 500);
  }
}
