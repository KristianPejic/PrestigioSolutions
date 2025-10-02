import { Component, OnInit } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { WerWirSindComponent } from './components/wer-wir-sind/wer-wir-sind';
import { ImageRevealComponent } from './components/image-reveal/image-reveal';
import { ShortServices } from './components/short-services/short-services';
import { FooterComponent } from './components/footer/footer';
import { NavbarComponent } from './components/navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroComponent,
    WerWirSindComponent,
    ImageRevealComponent,
    ShortServices,
    FooterComponent,
    NavbarComponent,
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'PrestigioSolutions';
  isLineExtended = false;
  leftLineConnected = false;
  rightLineConnected = false;
  showFooter = false;
  showNavbar = false;
  private hasAnimationCompleted = false;

  ngOnInit(): void {
    this.scrollToTop();
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
    // Connect the left and right lines after layout transforms
    setTimeout(() => {
      this.leftLineConnected = true;
      this.rightLineConnected = true;
      console.log('Left and right lines now connected');
    }, 300);
  }

  onTileAnimationComplete(): void {
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
