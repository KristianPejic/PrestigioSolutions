import { Component, Input, ChangeDetectorRef, NgZone, OnChanges, SimpleChanges, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { AnimationDirection, EasingType, MenuLink } from '../../models/types';
import { ANIMATION_DURATION } from '../../constants/animation.constants';
import { NavbarAnimationService } from '../../services/navbar-animation.service';
import { debugLog } from '../../enviroments/enviroments';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnChanges, OnDestroy {
  @Input() showNavbar = false;
  @Input() animationDirection: AnimationDirection = 'top-right-to-bottom-left';
  @Input() animationEasing: EasingType = 'smooth';
  @Input() animationDuration: number = ANIMATION_DURATION.NAVBAR_MASK;
  @Input() pauseDuration: number = ANIMATION_DURATION.NAVBAR_PAUSE;
  @Input() maskBackground: string = '#87CEEB';
  @Input() showLoadingIndicator: boolean = true;
  @Input() loadingText: string = 'Loading...';

  isMenuOpen = false;
  showMask = false;
  isCovering = false;
  isUncovering = false;
  isAnimating = false;
  isButtonDisabled = false;

  private buttonCooldownTimeout: ReturnType<typeof setTimeout> | null = null;
  private hamburgerButton: HTMLElement | null = null;
  private animationSubscription?: Subscription;
  private routerSubscription?: Subscription;
  private pendingRoute: string | null = null;

  menuLinks: MenuLink[] = [
    { name: 'Startseite', route: '/' },
    { name: 'Über Uns', route: '/über-uns' },
    { name: 'Services', route: '/unsere-services' },
    { name: 'Portfolio', route: '/portfolio' },
    { name: 'Kontakt', route: '/kontakt' },
    { name: 'Socials', route: '/socials' }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private navbarAnimationService: NavbarAnimationService
  ) {
    this.setupAnimationListener();
    this.setupRouterListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showNavbar']) {
      if (this.showNavbar) {
        this.revealNavbar();
      }
    }
  }

  ngOnDestroy(): void {
    this.animationSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    if (this.buttonCooldownTimeout) clearTimeout(this.buttonCooldownTimeout);
  }

  private setupAnimationListener(): void {
    this.animationSubscription = this.navbarAnimationService.animationState$.subscribe(state => {
      debugLog('Animation state:', state.phase, `${(state.progress * 100).toFixed(0)}%`);

      switch (state.phase) {
        case 'covering':
          this.showMask = true;
          this.isCovering = true;
          this.isUncovering = false;
          this.cdr.detectChanges();
          break;

        case 'covered':
          this.isCovering = false;
          this.isUncovering = false;
          this.cdr.detectChanges();
          break;

        case 'uncovering':
          this.isCovering = false;
          this.isUncovering = true;
          this.cdr.detectChanges();
          break;

        case 'complete':
          this.showMask = false;
          this.isCovering = false;
          this.isUncovering = false;
          this.isAnimating = false;
          this.returnFocusToHamburger();
          this.cdr.detectChanges();
          break;
      }
    });
  }

  private setupRouterListener(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      if (this.isMenuOpen) {
        debugLog('🔄 Route change detected while menu open - closing menu');
      }
    });
  }

  private revealNavbar(): void {
    const hostElement = this.elementRef.nativeElement;
    this.renderer.addClass(hostElement, 'show-navbar');
    debugLog('Navbar now visible after tile animation');
  }

  toggleMenu(): void {
    if (this.isButtonDisabled || this.isAnimating) {
      debugLog('Button disabled, ignoring click');
      return;
    }

    this.hamburgerButton = this.elementRef.nativeElement.querySelector('.hamburger-btn');
    this.disableButtonTemporarily();

    if (!this.isMenuOpen) {
      debugLog('Opening menu');
      this.startMenuOpenAnimation();
    } else {
      debugLog('Closing menu');
      this.startMenuCloseAnimation();
    }
  }

  handleMenuClick(link: MenuLink, event: Event): void {
    event.preventDefault();

    if (this.isButtonDisabled || this.isAnimating) {
      debugLog('Menu item disabled, ignoring click');
      return;
    }

    debugLog('🎯 Navigation to:', link.name, 'at route:', link.route);

    this.pendingRoute = link.route;
    this.disableButtonTemporarily();
    this.isMenuOpen = false;
    document.body.style.overflow = '';

    this.navbarAnimationService.startNavigation(
      () => {
        debugLog('🚀 Screen fully covered - executing navigation to:', this.pendingRoute);
        if (this.pendingRoute) {
          this.router.navigate([this.pendingRoute]).then(() => {
            debugLog('✅ Navigation complete - new route loaded');
            window.scrollTo(0, 0);
          });
        }
      },
      () => {
        debugLog('🎬 Full animation cycle finished');
        this.pendingRoute = null;
      }
    );
  }

  closeMenu(): void {
    if (this.isButtonDisabled || this.isAnimating) {
      debugLog('Close button disabled, ignoring click');
      return;
    }
    if (!this.isMenuOpen) {
      debugLog('Menu already closed, ignoring close');
      return;
    }

    this.disableButtonTemporarily();
    debugLog('Closing menu via close button');
    this.startMenuCloseAnimation();
  }

  private startMenuOpenAnimation(): void {
    this.isAnimating = true;
    this.showMask = true;
    this.isCovering = false;
    this.isUncovering = false;

    debugLog('Starting menu open animation');
    document.body.style.overflow = 'hidden';

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.isCovering = true;
          this.cdr.detectChanges();
        });
      }, 50);

      const coverCompleteTime = 50 + this.animationDuration;
      setTimeout(() => {
        this.ngZone.run(() => {
          debugLog('Screen covered - showing menu');
          this.isMenuOpen = true;
          this.isAnimating = false;
          this.cdr.detectChanges();
        });
      }, coverCompleteTime);

      const uncoverStartTime = coverCompleteTime + 50;
      setTimeout(() => {
        this.ngZone.run(() => {
          this.isUncovering = true;
          this.cdr.detectChanges();
        });
      }, uncoverStartTime);

      const totalTime = uncoverStartTime + this.animationDuration + 50;
      setTimeout(() => {
        this.ngZone.run(() => {
          this.showMask = false;
          this.isCovering = false;
          this.isUncovering = false;
          debugLog('Menu open animation complete');
          this.cdr.detectChanges();
        });
      }, totalTime);
    });
  }

  private startMenuCloseAnimation(): void {
    this.isAnimating = true;

    this.navbarAnimationService.startNavigation(
      () => {
        debugLog('Menu closing - hiding menu');
        this.isMenuOpen = false;
        document.body.style.overflow = '';
      },
      () => {
        debugLog('Menu close animation complete');
      }
    );
  }

  private returnFocusToHamburger(): void {
    if (this.hamburgerButton) {
      setTimeout(() => {
        (this.hamburgerButton as HTMLElement).focus();
        debugLog('Focus returned to hamburger button');
      }, 100);
    }
  }

  getMaskClasses(): string {
    let classes = 'diagonal-mask';

    switch (this.animationDirection) {
      case 'top-right-to-bottom-left':
        classes += ' tr-bl';
        break;
      case 'top-left-to-bottom-right':
        classes += ' tl-br';
        break;
      case 'bottom-left-to-top-right':
        classes += ' bl-tr';
        break;
      case 'bottom-right-to-top-left':
        classes += ' br-tl';
        break;
    }

    classes += ` ${this.animationEasing}`;

    if (this.isCovering && !this.isUncovering) {
      classes += ' mask-covering';
    } else if (this.isUncovering) {
      classes += ' mask-uncovering';
    }

    return classes;
  }

  private disableButtonTemporarily(): void {
    this.isButtonDisabled = true;
    debugLog('All buttons disabled for', ANIMATION_DURATION.NAVBAR_COOLDOWN, 'ms');

    if (this.buttonCooldownTimeout) {
      clearTimeout(this.buttonCooldownTimeout);
    }

    this.buttonCooldownTimeout = setTimeout(() => {
      this.isButtonDisabled = false;
      debugLog('All buttons re-enabled');
      this.cdr.detectChanges();
    }, ANIMATION_DURATION.NAVBAR_COOLDOWN);
  }
}
