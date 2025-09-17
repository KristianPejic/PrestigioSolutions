import { Component, EventEmitter, Output } from '@angular/core';
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
  showNavbar = false; // shown only after full animation
  revealText = false;

  @Output() animationComplete = new EventEmitter<void>();
  @Output() menuToggle = new EventEmitter<boolean>();

  onFirstWaveComplete(): void {
    this.showScrollingText = true;
    // DO NOT show navbar yet
  }

  onTileAnimationComplete(): void {
    this.revealText = true;
    this.showNavbar = true; // navbar only after full animation
    this.animationComplete.emit(); // notify AppComponent
  }

  onHeroReset(): void {
    this.showScrollingText = false;
    this.showNavbar = false;
    this.revealText = false;
  }

  onMenuToggle(isOpen: boolean): void {
    this.menuToggle.emit(isOpen);
  }

  onDiscoverClick(): void {
    console.log('Jetzt entdecken clicked!');
  }
}
