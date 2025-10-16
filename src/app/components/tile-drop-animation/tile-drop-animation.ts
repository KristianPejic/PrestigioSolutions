import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tile } from '../../models/types';
import { ANIMATION_DURATION, ANIMATION_DELAYS } from '../../constants/animation.constants';
import { debugLog } from '../../enviroments/enviroments';

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

  tiles: Tile[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.generateRandomTileSequence();
    this.startTileAnimation();
    this.preventScrolling();
  }

  ngOnDestroy(): void {
    this.allowScrolling();
  }

  startTileAnimation(): void {
    this.showTiles = true;
    this.animationFinished = false;
    this.preventScrolling();

    this.tiles.forEach(tile => {
      tile.isCovering = false;
      tile.isUncovering = false;
    });
    this.cdr.detectChanges();

    this.ngZone.runOutsideAngular(() => {
      this.tiles.forEach((tile, index) => {
        setTimeout(() => {
          this.ngZone.run(() => {
            tile.isCovering = true;
            debugLog(`Tile ${index + 1} covering`);
            this.cdr.detectChanges();
          });
        }, tile.coverDelay);
      });

      const maxCoverTime = Math.max(...this.tiles.map(t => t.coverDelay)) + 700;
      setTimeout(() => {
        this.ngZone.run(() => {
          this.firstWaveComplete.emit();
          debugLog('First wave complete');
        });
      }, maxCoverTime);

      const uncoverStartDelay = 2200;
      this.tiles.forEach((tile, index) => {
        setTimeout(() => {
          this.ngZone.run(() => {
            tile.isUncovering = true;
            debugLog(`Tile ${index + 1} uncovering`);
            this.cdr.detectChanges();
          });
        }, uncoverStartDelay + tile.uncoverDelay);
      });

      const maxUncoverTime = uncoverStartDelay + Math.max(...this.tiles.map(t => t.uncoverDelay)) + 950;
      setTimeout(() => {
        this.ngZone.run(() => {
          this.animationComplete.emit();
          this.animationFinished = true;
          this.showTiles = false;
          this.allowScrolling();
          debugLog('Animation complete');
          this.cdr.detectChanges();
        });
      }, maxUncoverTime);
    });
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

  private generateRandomTileSequence(): void {
    const tileIds = [1, 2, 3, 4];
    const coverSequence = [1, 2, 3, 0];
    const uncoverSequence = [0, 3, 2, 1];
    const baseDelay = ANIMATION_DELAYS.TILE_STAGGER;

    this.tiles = tileIds.map((id, index) => {
      const coverPosition = coverSequence.indexOf(index);
      const uncoverPosition = uncoverSequence.indexOf(index);

      return {
        id,
        isCovering: false,
        isUncovering: false,
        coverDelay: coverPosition * baseDelay,
        uncoverDelay: uncoverPosition * baseDelay
      };
    });

    debugLog('Generated tile sequence:');
    debugLog('Cover order: Tile 2, Tile 3, Tile 4, Tile 1');
    debugLog('Uncover order: Tile 1, Tile 4, Tile 3, Tile 2');
    this.tiles.forEach(tile => {
      debugLog(`Tile ${tile.id}: cover delay ${tile.coverDelay}ms, uncover delay ${tile.uncoverDelay}ms`);
    });
  }

  regenerateRandomSequence(): void {
    this.generateRandomTileSequence();
    debugLog('Regenerated random sequence');
  }

  trackByTileId(index: number, tile: Tile): number {
    return tile.id;
  }

  getTransitionDelay(tile: Tile): number {
    if (tile.isCovering && !tile.isUncovering) {
      return tile.coverDelay;
    } else if (tile.isUncovering) {
      return tile.uncoverDelay;
    }
    return 0;
  }
}
