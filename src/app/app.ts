import { Component, OnInit } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { WerWirSindComponent } from './components/wer-wir-sind/wer-wir-sind';
import { ImageRevealComponent } from './components/image-reveal/image-reveal';
import { ShortServices } from './components/short-services/short-services';
import { FooterComponent } from './components/footer/footer';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroComponent,
    WerWirSindComponent,
    ImageRevealComponent,
    ShortServices,
    FooterComponent,
    NavbarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'PrestigioSolutions';
  isLineExtended = false;
  showFooter = false; // Control footer visibility
  showNavbar = false; // Control navbar visibility
  private hasAnimationCompleted = false; // Track if animation has run once

  ngOnInit(): void {
    // Force scroll to top on component initialization (page refresh)
    this.scrollToTop();
  }

  private scrollToTop(): void {
    // Method 1: Immediate scroll
    window.scrollTo(0, 0);

    // Method 2: Also set scroll position on document
    if (typeof document !== 'undefined') {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }

  // This method receives the event from wer-wir-sind when line extends
  onLineExtended(extended: boolean): void {
    this.isLineExtended = extended;
    console.log('Line extended from wer-wir-sind:', extended);
  }

  onImageRevealed(): void {
    console.log('Image revealed!');
  }

  // This method receives the event when tile animation completes
  onTileAnimationComplete(): void {
    // Only show footer/navbar the FIRST time animation completes
    if (!this.hasAnimationCompleted) {
      this.showFooter = true;
      this.showNavbar = true;
      this.hasAnimationCompleted = true;
      console.log('Tile animation complete - showing footer and navbar (FIRST TIME)');
    } else {
      console.log('Tile animation complete - footer and navbar already shown');
    }
  }
}
