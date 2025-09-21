import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tile {
  id: number;
  isCovering?: boolean;
  isUncovering?: boolean;
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
    { id: 1},
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
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
      setTimeout(() => tile.isCovering = true , tile.id);
    });

    // Emit first wave complete
    setTimeout(() => {
      this.firstWaveComplete.emit();
    this.tiles =this.tiles.reverse();
    }, 1400);

    // Phase 2: Uncover
    const uncoverStartDelay = 1400;
    this.tiles.forEach(tile => {
      setTimeout(() => tile.isUncovering = true, uncoverStartDelay + tile.id);
    });


    // Complete removal
    setTimeout(() => {
      this.animationComplete.emit();
      this.animationFinished = true;
      this.showTiles = false;
      this.allowScrolling();
    }, uncoverStartDelay * 3);
  }

  get animationSpeed(){
    return Math.random() * (2.5 - 1) + 1;
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
