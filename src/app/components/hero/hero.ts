import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
}
