import { Component, OnInit } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { WerWirSindComponent } from './components/wer-wir-sind/wer-wir-sind';
import { ImageRevealComponent } from './components/image-reveal/image-reveal';
import { ShortServices } from './components/short-services/short-services';
import { FooterComponent } from './components/footer/footer';
import { NavbarComponent } from './components/navbar/navbar';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

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
    RouterModule,
    CommonModule
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
  showLandingPage = true;
  showTileAnimation = false;
  private hasAnimationCompleted = false;
  private hasVisitedBefore = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.scrollToTop();

    // Check if user has visited before (in this session)
    const hasVisited = sessionStorage.getItem('hasVisitedHome');
    this.hasVisitedBefore = hasVisited === 'true';

    // Check if we're on a route or landing page
    const currentUrl = this.router.url;
    if (currentUrl === '/' || currentUrl === '') {
      this.showLandingPage = true;

      if (this.hasVisitedBefore) {
        // Skip animation, show footer and navbar immediately
        this.showTileAnimation = false;
        this.showFooter = true;
        this.showNavbar = true;
        this.hasAnimationCompleted = true;
        console.log('Returning to home - skipping tile animation');
      } else {
        // First visit - show tile animation
        this.showTileAnimation = true;
        this.showFooter = false;
        this.showNavbar = false;
        sessionStorage.setItem('hasVisitedHome', 'true');
        console.log('First visit to home - showing tile animation');
      }
    } else {
      this.showLandingPage = false;
      this.showTileAnimation = false;
      this.showFooter = true;
      this.showNavbar = true;
    }

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Show landing page only on root path
      if (event.url === '/' || event.url === '') {
        this.showLandingPage = true;

        // Check if we should show tile animation
        const hasVisited = sessionStorage.getItem('hasVisitedHome');
        if (hasVisited === 'true') {
          // Already visited - skip animation
          this.showTileAnimation = false;
          this.showFooter = true;
          this.showNavbar = true;
          this.hasAnimationCompleted = true;
          console.log('Navigating back to home - skipping tile animation');
        } else {
          // First visit - show animation
          this.showTileAnimation = true;
          this.showFooter = false;
          this.showNavbar = false;
          this.hasAnimationCompleted = false;
          sessionStorage.setItem('hasVisitedHome', 'true');
          console.log('First navigation to home - showing tile animation');
        }
      } else {
        // Hide landing page, show routed component
        this.showLandingPage = false;
        this.showTileAnimation = false;
        this.showFooter = true;
        this.showNavbar = true;
      }

      // Scroll to top on route change
      this.scrollToTop();
    });
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
      this.showFooter = true;
      this.showNavbar = true;
      this.hasAnimationCompleted = true;
      console.log('Tile animation complete - showing footer and navbar');
    }
  }
}
