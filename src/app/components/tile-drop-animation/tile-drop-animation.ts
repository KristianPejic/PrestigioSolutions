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
  @Output() firstWaveComplete = new EventEmitter<void>();
  @Output() animationComplete = new EventEmitter<void>();
  @Output() animationReset = new EventEmitter<void>();

  showTiles = true; // controls DOM removal after uncover

  tiles: Tile[] = [
    { id: 1, isCovering: false, isUncovering: false, coverDelay: 0, uncoverDelay: 0 },
    { id: 2, isCovering: false, isUncovering: false, coverDelay: 100, uncoverDelay: 100 },
    { id: 3, isCovering: false, isUncovering: false, coverDelay: 200, uncoverDelay: 200 },
    { id: 4, isCovering: false, isUncovering: false, coverDelay: 300, uncoverDelay: 300 }
  ];

  ngOnInit(): void {
    this.startTileAnimation();
  }

  startTileAnimation(): void {
    // Phase 1: Cover
    this.tiles.forEach(tile => {
      setTimeout(() => tile.isCovering = true, tile.coverDelay);
    });

    // Emit first wave complete (after cover)
    setTimeout(() => this.firstWaveComplete.emit(), 800); // animation duration still 0.8s

    // Phase 2: Uncover (longer duration)
    const uncoverStartDelay = 2000; // <-- increase delay before uncover
    this.tiles.forEach(tile => {
      setTimeout(() => tile.isUncovering = true, uncoverStartDelay + tile.uncoverDelay);
    });

    // Emit animation complete after second wave finishes
    setTimeout(() => {
      this.animationComplete.emit();
      // Remove tiles from DOM so they don’t block clicks
      this.showTiles = false;
    }, uncoverStartDelay + 1200); // <-- increase uncover animation duration if needed
  }

  resetAnimation(): void {
    this.showTiles = true;
    this.tiles.forEach(tile => {
      tile.isCovering = false;
      tile.isUncovering = false;
    });
    this.animationReset.emit();

    setTimeout(() => this.startTileAnimation(), 50);
  }
}
