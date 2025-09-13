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
  showNavbar = false;  // Control navbar visibility
  revealText = false;

  constructor(private router: Router) {}

  onFirstWaveComplete(): void {
    this.showScrollingText = true;
    this.showNavbar = true;  // Show navbar at same time as text
  }

  onTileAnimationComplete(): void {
    this.revealText = true;
  }

  onHeroReset(): void {
    this.showScrollingText = false;
    this.showNavbar = false;  // Hide navbar on reset
    this.revealText = false;
  }

  onDiscoverClick(): void {
    // Add your navigation logic here
    // Example: this.router.navigate(['/services']);
    console.log('Jetzt entdecken clicked!');

    // You can add smooth scrolling to a section
    // const element = document.getElementById('services');
    // element?.scrollIntoView({ behavior: 'smooth' });

    // Or navigate to another route
    // this.router.navigate(['/discover']);
  }
}
