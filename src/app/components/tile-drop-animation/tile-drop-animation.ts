import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tile {
  id: number;
  isCovering: boolean;
  isUncovering: boolean;
  coverDelay: number;
  uncoverDelay: number;
}

@Component({
  selector: 'app-tile-drop-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tile-drop-animation.html',
  styleUrls: ['./tile-drop-animation.css']
})
export class TileDropAnimationComponent implements OnInit, OnDestroy {
  @Output() firstWaveComplete = new EventEmitter<void>();
  @Output() animationComplete = new EventEmitter<void>();
  @Output() animationReset = new EventEmitter<void>();

  showTiles = true;
  animationFinished = false;

  tiles: Tile[] = [
    { id: 1, isCovering: false, isUncovering: false, coverDelay: 0, uncoverDelay: 0 },
    { id: 2, isCovering: false, isUncovering: false, coverDelay: 100, uncoverDelay: 100 },
    { id: 3, isCovering: false, isUncovering: false, coverDelay: 200, uncoverDelay: 200 },
    { id: 4, isCovering: false, isUncovering: false, coverDelay: 300, uncoverDelay: 300 }
  ];

  ngOnInit(): void {
    this.startTileAnimation();
    this.preventScrolling();
  }

  ngOnDestroy(): void {
    // Properly implemented - restore scrolling when component is destroyed
    this.allowScrolling();
  }

  startTileAnimation(): void {
    this.showTiles = true;
    this.animationFinished = false;
    this.preventScrolling();

    // Phase 1: Cover
    this.tiles.forEach(tile => {
      setTimeout(() => tile.isCovering = true, tile.coverDelay);
    });

    // Emit first wave complete
    setTimeout(() => this.firstWaveComplete.emit(), 800);

    // Phase 2: Uncover
    const uncoverStartDelay = 2000;
    this.tiles.forEach(tile => {
      setTimeout(() => tile.isUncovering = true, uncoverStartDelay + tile.uncoverDelay);
    });

    // Complete removal
    setTimeout(() => {
      this.animationComplete.emit();
      this.animationFinished = true;
      this.showTiles = false;
      this.allowScrolling();
    }, uncoverStartDelay + 750);
  }
  private preventScrolling(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
  }

  private allowScrolling(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }
}
