import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HeroComponent implements OnInit, OnDestroy {
  showScrollingText = false;
  showNavbar = false;
  revealText = false;
  showHeroContent = false;
  activeSlide = 0;
  slideInterval: any;

  // Add timeout reference for cleanup
  private heroContentTimeout: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
    // Clear the hero content timeout if component is destroyed
    if (this.heroContentTimeout) {
      clearTimeout(this.heroContentTimeout);
    }
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % 3; // 3 slides
    }, 5000); // 5 seconds
  }

  onFirstWaveComplete(): void {
    this.showScrollingText = true;
    this.showNavbar = true;

    // Delay the hero content appearance by 1750ms (1.75 seconds) after first wave completes
    this.heroContentTimeout = setTimeout(() => {
      this.showHeroContent = true;
    }, 1500); // Reduced by 0.25 seconds (250ms)
  }

  onTileAnimationComplete(): void {
    this.revealText = true;
    // Ensure hero content is shown if not already (fallback)
    if (!this.showHeroContent) {
      this.showHeroContent = true;
    }
  }

  onHeroReset(): void {
    this.showScrollingText = false;
    this.showNavbar = false;
    this.revealText = false;
    this.showHeroContent = false;

    // Clear any pending hero content timeout
    if (this.heroContentTimeout) {
      clearTimeout(this.heroContentTimeout);
      this.heroContentTimeout = null;
    }
  }

  onDiscoverClick(): void {
    console.log('Jetzt entdecken clicked!');
  }
}
