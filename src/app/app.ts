import { Component, OnInit } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { WerWirSindComponent } from './components/wer-wir-sind/wer-wir-sind';
import { ImageRevealComponent } from './components/image-reveal/image-reveal';
import { YearAnimationComponent } from './components/year-animation/year-animation';
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
    YearAnimationComponent,
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

  private readonly SESSION_KEY = 'hasSeenTileAnimation';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.scrollToTop();

    // DEVELOPMENT ONLY: Uncomment this line to always show animation during testing
    // sessionStorage.removeItem(this.SESSION_KEY);

    // FIRST: Clear any existing session to test fresh
    console.log('=== DEBUGGING TILE ANIMATION ===');
    console.log('Current sessionStorage value:', sessionStorage.getItem(this.SESSION_KEY));

    // Check if we're on a route or landing page
    const currentUrl = this.router.url;
    console.log('Current URL:', currentUrl);

    if (currentUrl === '/' || currentUrl === '') {
      this.showLandingPage = true;
      console.log('✓ On home page - showLandingPage:', this.showLandingPage);

      // Check session AFTER we know we're on home
      const hasSeenAnimation = sessionStorage.getItem(this.SESSION_KEY);
      console.log('Has seen animation this session?', hasSeenAnimation);

      if (hasSeenAnimation === 'true') {
        // Already seen animation this session - skip it
        this.showTileAnimation = false;
        this.showFooter = true;
        this.showNavbar = true;
        this.hasAnimationCompleted = true;
        console.log('❌ Skipping animation - already seen this session');
      } else {
        // First time this session - show tile animation
        this.showTileAnimation = true;
        this.showFooter = false;
        this.showNavbar = false;
        console.log('✅ SHOWING TILE ANIMATION - First time this session');
        console.log('showTileAnimation:', this.showTileAnimation);
        console.log('showFooter:', this.showFooter);
        console.log('showNavbar:', this.showNavbar);

        // Mark as seen AFTER animation completes, not before
        // We'll set this in onTileAnimationComplete() instead
      }
    } else {
      this.showLandingPage = false;
      this.showTileAnimation = false;
      this.showFooter = true;
      this.showNavbar = true;
      console.log('ℹ Not on home page - skipping animation');
    }

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Show landing page only on root path
      if (event.url === '/' || event.url === '') {
        this.showLandingPage = true;

        // Check if user has seen animation this session
        const hasSeenAnimation = sessionStorage.getItem(this.SESSION_KEY);
        if (hasSeenAnimation === 'true') {
          // Already seen in this session - skip animation
          this.showTileAnimation = false;
          this.showFooter = true;
          this.showNavbar = true;
          this.hasAnimationCompleted = true;
          console.log('Navigating back to home - animation already seen this session');
        } else {
          // First time this session - show animation
          this.showTileAnimation = true;
          this.showFooter = false;
          this.showNavbar = false;
          this.hasAnimationCompleted = false;
          sessionStorage.setItem(this.SESSION_KEY, 'true');
          console.log('First navigation to home this session - showing tile animation');
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

      // NOW mark as seen in session (after animation completes)
      sessionStorage.setItem(this.SESSION_KEY, 'true');

      console.log('✅ Tile animation complete - showing footer and navbar');
      console.log('Session marked as seen');
    }
  }

  // Optional: Method to reset session (useful for testing)
  // The animation will automatically show again when opening a new tab/window
  resetSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    console.log('Session reset - reload page to see animation again');
    window.location.reload();
  }
}
