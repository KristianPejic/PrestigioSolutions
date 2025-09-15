import { Component } from '@angular/core';
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
export class HeroComponent {
  showScrollingText = false;
  showNavbar = false;
  revealText = false;
  showHeroContent = false; // New property for hero content timing

  constructor(private router: Router) {}

  onFirstWaveComplete(): void {
    this.showScrollingText = true;
    this.showNavbar = true;
    // Show hero content during the animation (after first wave)
    this.showHeroContent = true;
  }

  onTileAnimationComplete(): void {
    this.revealText = true;
    // Ensure hero content is visible after animation completes
    this.showHeroContent = true;
  }

  onHeroReset(): void {
    this.showScrollingText = false;
    this.showNavbar = false;
    this.revealText = false;
    this.showHeroContent = false; // Reset hero content
  }

  onDiscoverClick(): void {
    console.log('Jetzt entdecken clicked!');
    // Add your navigation logic here
  }
}
