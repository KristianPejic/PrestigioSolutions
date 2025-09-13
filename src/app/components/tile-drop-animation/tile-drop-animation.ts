import { Component, OnInit } from '@angular/core';
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
  tiles: Tile[] = [
    {
      id: 1,
      isCovering: false,
      isUncovering: false,
      coverDelay: 0,     // 1st - drops first when covering
      uncoverDelay: 0    // 1st - drops first when uncovering
    },
    {
      id: 2,
      isCovering: false,
      isUncovering: false,
      coverDelay: 80,    // 2nd - drops second when covering
      uncoverDelay: 80   // 2nd - drops second when uncovering
    },
    {
      id: 3,
      isCovering: false,
      isUncovering: false,
      coverDelay: 160,   // 3rd - drops third when covering
      uncoverDelay: 240  // 4th - drops LAST when uncovering (3rd and 4th switched)
    },
    {
      id: 4,
      isCovering: false,
      isUncovering: false,
      coverDelay: 240,   // 4th - drops fourth when covering
      uncoverDelay: 160  // 3rd - drops THIRD when uncovering (3rd and 4th switched)
    }
  ];

  ngOnInit(): void {
    // Start animation immediately
    this.startTileAnimation();
  }

  startTileAnimation(): void {
    // Phase 1: Tiles drop to cover in regular order (1, 2, 3, 4)
    this.tiles.forEach((tile) => {
      setTimeout(() => {
        tile.isCovering = true;
      }, tile.coverDelay);
    });

    // Phase 2: Tiles drop to uncover in mixed order (1, 2, 4, 3)
    const uncoverStartDelay = 1200;

    this.tiles.forEach((tile) => {
      setTimeout(() => {
        tile.isUncovering = true;
      }, uncoverStartDelay + tile.uncoverDelay);
    });
  }

  resetAnimation(): void {
    this.tiles.forEach(tile => {
      tile.isCovering = false;
      tile.isUncovering = false;
    });

    setTimeout(() => {
      this.startTileAnimation();
    }, 50);
  }
}
