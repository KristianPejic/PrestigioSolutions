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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % 3; // 3 slides
    }, 5000); // 5 seconds
  }

  onFirstWaveComplete(): void {
    this.showScrollingText = true;
    this.showNavbar = true;
    this.showHeroContent = true;
  }

  onTileAnimationComplete(): void {
    this.revealText = true;
    this.showHeroContent = true;
  }

  onHeroReset(): void {
    this.showScrollingText = false;
    this.showNavbar = false;
    this.revealText = false;
    this.showHeroContent = false;
  }

  onDiscoverClick(): void {
    console.log('Jetzt entdecken clicked!');
  }
}
