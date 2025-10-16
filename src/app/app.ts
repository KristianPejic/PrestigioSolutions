import { Component, OnInit } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { WerWirSindComponent } from './components/wer-wir-sind/wer-wir-sind';
import { ImageRevealComponent } from './components/image-reveal/image-reveal';
import { YearAnimationComponent } from './components/year-animation/year-animation';
import { ShortServices } from './components/short-services/short-services';
import { FooterComponent } from './components/footer/footer';
import { NavbarComponent } from './components/navbar/navbar';
import { SkipLinkComponent } from './components/skip-link/skip.link';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SessionService } from './services/session.service';
import { SeoService } from './services/seo.service';
import { debugLog } from './enviroments/enviroments';

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
    SkipLinkComponent,
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

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.scrollToTop();
    this.seoService.setDefaults();

    debugLog('=== DEBUGGING TILE ANIMATION ===');
    debugLog('Current sessionStorage value:', this.sessionService.getItem(this.SESSION_KEY));

    const currentUrl = this.router.url;
    debugLog('Current URL:', currentUrl);

    if (currentUrl === '/' || currentUrl === '') {
      this.showLandingPage = true;
      debugLog('✓ On home page - showLandingPage:', this.showLandingPage);

      const hasSeenAnimation = this.sessionService.getItem(this.SESSION_KEY);
      debugLog('Has seen animation this session?', hasSeenAnimation);

      if (hasSeenAnimation === 'true') {
        this.showTileAnimation = false;
        this.showFooter = true;
        this.showNavbar = true;
        this.hasAnimationCompleted = true;
        debugLog('❌ Skipping animation - already seen this session');
      } else {
        this.showTileAnimation = true;
        this.showFooter = false;
        this.showNavbar = false;
        debugLog('✅ SHOWING TILE ANIMATION - First time this session');
        debugLog('showTileAnimation:', this.showTileAnimation);
        debugLog('showFooter:', this.showFooter);
        debugLog('showNavbar:', this.showNavbar);
      }
    } else {
      this.showLandingPage = false;
      this.showTileAnimation = false;
      this.showFooter = true;
      this.showNavbar = true;
      debugLog('ℹ Not on home page - skipping animation');
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/' || event.url === '') {
        this.showLandingPage = true;

        const hasSeenAnimation = this.sessionService.getItem(this.SESSION_KEY);
        if (hasSeenAnimation === 'true') {
          this.showTileAnimation = false;
          this.showFooter = true;
          this.showNavbar = true;
          this.hasAnimationCompleted = true;
          debugLog('Navigating back to home - animation already seen this session');
        } else {
          this.showTileAnimation = true;
          this.showFooter = false;
          this.showNavbar = false;
          this.hasAnimationCompleted = false;
          this.sessionService.setItem(this.SESSION_KEY, 'true');
          debugLog('First navigation to home this session - showing tile animation');
        }
      } else {
        this.showLandingPage = false;
        this.showTileAnimation = false;
        this.showFooter = true;
        this.showNavbar = true;
      }

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
    debugLog('Line extended from wer-wir-sind:', extended);
  }

  onImageRevealed(): void {
    debugLog('Image revealed!');
  }

  onLayoutTransformed(): void {
    debugLog('Layout transformed - connecting additional lines');
    setTimeout(() => {
      this.leftLineConnected = true;
      this.rightLineConnected = true;
      debugLog('Left and right lines now connected');
    }, 300);
  }

  onTileAnimationComplete(): void {
    if (!this.hasAnimationCompleted) {
      this.showFooter = true;
      this.showNavbar = true;
      this.hasAnimationCompleted = true;

      this.sessionService.setItem(this.SESSION_KEY, 'true');

      debugLog('✅ Tile animation complete - showing footer and navbar');
      debugLog('Session marked as seen');
    }
  }

  resetSession(): void {
    this.sessionService.removeItem(this.SESSION_KEY);
    debugLog('Session reset - reload page to see animation again');
    window.location.reload();
  }
}
