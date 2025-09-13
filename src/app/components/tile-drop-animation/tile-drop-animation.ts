import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tile {
  id: number;
  isCovering: boolean;
  isUncovering: boolean;
  delay: number;
}

@Component({
  selector: 'app-tile-drop-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tile-drop-animation.html',
  styleUrls: ['./tile-drop-animation.css']
})
export class TileDropAnimationComponent implements OnInit {
  tiles: Tile[] = [
    { id: 1, isCovering: false, isUncovering: false, delay: 0 },     // 0ms
    { id: 2, isCovering: false, isUncovering: false, delay: 100 },   // 100ms
    { id: 3, isCovering: false, isUncovering: false, delay: 200 },   // 200ms
    { id: 4, isCovering: false, isUncovering: false, delay: 300 }    // 300ms
  ];

  ngOnInit(): void {
    // Start animation immediately
    this.startTileAnimation();
  }

  startTileAnimation(): void {
    // Phase 1: Tiles drop down to cover the screen
    this.tiles.forEach((tile) => {
      setTimeout(() => {
        tile.isCovering = true;
      }, tile.delay);
    });

    // Phase 2: After a pause, tiles drop again to uncover
    const uncoverStartDelay = 2000;

    this.tiles.forEach((tile) => {
      setTimeout(() => {
        tile.isUncovering = true;
      }, uncoverStartDelay + tile.delay);
    });
  }
}
