import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HeroComponent } from '../../hero/hero';
import { WerWirSindComponent } from '../../wer-wir-sind/wer-wir-sind';
import { ImageRevealComponent } from '../../image-reveal/image-reveal';
import { ShortServices } from '../../short-services/short-services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    WerWirSindComponent,
    ImageRevealComponent,
    ShortServices
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {
  @Output() showFooterEvent = new EventEmitter<boolean>();

  isLineExtended = false;
  leftLineConnected = false;
  rightLineConnected = false;
  private hasAnimationCompleted = false;
  private fallbackTimeout: any;

  ngOnInit(): void {
    this.scrollToTop();
    // Hide footer initially on home page
    this.showFooterEvent.emit(false);

    // Fallback: Show footer after 6 seconds if animation doesn't complete
    this.fallbackTimeout = setTimeout(() => {
      if (!this.hasAnimationCompleted) {
        console.log('Fallback: Forcing footer to show after 6 seconds');
        this.showFooterEvent.emit(true);
        this.hasAnimationCompleted = true;
      }
    }, 6000);
  }

  ngOnDestroy(): void {
    if (this.fallbackTimeout) {
      clearTimeout(this.fallbackTimeout);
    }
  }

  private scrollToTop(): void {
    window.scrollTo(0, 0);
    if (typeof document !== 'undefined') {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }

  onLineExtended(extended: boolean): void {
    this.isLineExtended = extended;
    console.log('Line extended from wer-wir-sind:', extended);
  }

  onImageRevealed(): void {
    console.log('Image revealed!');
  }

  onLayoutTransformed(): void {
    console.log('Layout transformed - connecting additional lines');
    setTimeout(() => {
      this.leftLineConnected = true;
      this.rightLineConnected = true;
      console.log('Left and right lines now connected');
    }, 300);
  }

  onTileAnimationComplete(): void {
    if (!this.hasAnimationCompleted) {
      this.hasAnimationCompleted = true;
      // Clear fallback timeout
      if (this.fallbackTimeout) {
        clearTimeout(this.fallbackTimeout);
      }
      // Show footer after tile animation completes
      this.showFooterEvent.emit(true);
      console.log('Tile animation complete - showing footer');
    }
  }
}
