import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
export class TileDropAnimationComponent implements OnInit {
  @Output() firstWaveComplete = new EventEmitter<void>();  // New event for first wave
  @Output() animationComplete = new EventEmitter<void>();
  @Output() animationReset = new EventEmitter<void>();

  tiles: Tile[] = [
    { id: 1, isCovering: false, isUncovering: false, coverDelay: 0, uncoverDelay: 0 },
    { id: 2, isCovering: false, isUncovering: false, coverDelay: 80, uncoverDelay: 80 },
    { id: 3, isCovering: false, isUncovering: false, coverDelay: 160, uncoverDelay: 240 },
    { id: 4, isCovering: false, isUncovering: false, coverDelay: 240, uncoverDelay: 160 }
  ];

  ngOnInit(): void {
    this.startTileAnimation();
  }

  startTileAnimation(): void {
    // Phase 1: Tiles drop to cover
    this.tiles.forEach((tile) => {
      setTimeout(() => {
        tile.isCovering = true;
      }, tile.coverDelay);
    });

    // Emit first wave complete (when screen is fully covered)
    setTimeout(() => {
      this.firstWaveComplete.emit();
    }, 800); // After all tiles have covered (last tile delay 240ms + animation time)

    // Phase 2: Tiles drop to uncover
    const uncoverStartDelay = 1200;

    this.tiles.forEach((tile) => {
      setTimeout(() => {
        tile.isUncovering = true;
      }, uncoverStartDelay + tile.uncoverDelay);
    });

    // Emit animation complete event (when content is revealed)
    setTimeout(() => {
      this.animationComplete.emit();
    }, uncoverStartDelay + 600);
  }

  resetAnimation(): void {
    this.tiles.forEach(tile => {
      tile.isCovering = false;
      tile.isUncovering = false;
    });

    this.animationReset.emit();

    setTimeout(() => {
      this.startTileAnimation();
    }, 50);
  }
}
