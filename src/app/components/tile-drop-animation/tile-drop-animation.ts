import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
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

    // Reset all tiles
    this.tiles.forEach(tile => {
      tile.isCovering = false;
      tile.isUncovering = false;
    });
    this.cdr.detectChanges();

    // Run animation outside Angular zone for better performance
    this.ngZone.runOutsideAngular(() => {
      // Phase 1: Cover tiles one by one
      this.tiles.forEach((tile, index) => {
        setTimeout(() => {
          this.ngZone.run(() => {
            tile.isCovering = true;
            console.log(`Tile ${index + 1} covering`);
            this.cdr.detectChanges();
          });
        }, tile.coverDelay);
      });

      // Wait for covering phase to complete
      const maxCoverTime = Math.max(...this.tiles.map(t => t.coverDelay)) + 700; // Reduced for faster animation
      setTimeout(() => {
        this.ngZone.run(() => {
          this.firstWaveComplete.emit();
          console.log('First wave complete');
        });
      }, maxCoverTime);

      // Phase 2: Uncover tiles (the second wave you're missing!)
      const uncoverStartDelay = 2200; // Start uncovering after 2.2 seconds
      this.tiles.forEach((tile, index) => {
        setTimeout(() => {
          this.ngZone.run(() => {
            tile.isUncovering = true;
            console.log(`Tile ${index + 1} uncovering`);
            this.cdr.detectChanges();
          });
        }, uncoverStartDelay + tile.uncoverDelay);
      });

      // Complete the animation
      const maxUncoverTime = uncoverStartDelay + Math.max(...this.tiles.map(t => t.uncoverDelay)) + 950; // Adjusted for faster animation
      setTimeout(() => {
        this.ngZone.run(() => {
          this.animationComplete.emit();
          this.animationFinished = true;
          this.showTiles = false;
          this.allowScrolling();
          console.log('Animation complete');
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
    // Create array of tile IDs
    const tileIds = [1, 2, 3, 4];

    // Define specific sequence: 2nd, 3rd, 4th, 1st (positions 1, 2, 3, 0)
    const coverSequence = [1, 2, 3, 0]; // Index positions for tiles 2, 3, 4, 1
    const uncoverSequence = [0, 3, 2, 1]; // Reverse: 1st, 4th, 3rd, 2nd (positions 0, 3, 2, 1)

    // Generate delays based on sequence (60ms apart for faster stagger)
    const baseDelay = 60;

    // Create tiles with sequence-based delays
    this.tiles = tileIds.map((id, index) => {
      // Find position in cover sequence
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

    console.log('Generated tile sequence:');
    console.log('Cover order: Tile 2, Tile 3, Tile 4, Tile 1');
    console.log('Uncover order: Tile 1, Tile 4, Tile 3, Tile 2');
    this.tiles.forEach(tile => {
      console.log(`Tile ${tile.id}: cover delay ${tile.coverDelay}ms, uncover delay ${tile.uncoverDelay}ms`);
    });
  }

  private generateRandomDelays(count: number, minDelay: number, maxDelay: number): number[] {
    const delays: number[] = [];

    for (let i = 0; i < count; i++) {
      const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      delays.push(randomDelay);
    }

    return delays.sort((a, b) => a - b); // Optional: sort to maintain some order
  }

  // Method to regenerate random sequence (useful for testing)
  regenerateRandomSequence(): void {
    this.generateRandomTileSequence();
    console.log('Regenerated random sequence');
  }

  // Helper methods for template
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
