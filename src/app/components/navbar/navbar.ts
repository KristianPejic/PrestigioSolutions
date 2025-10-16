import { Component, Input, ChangeDetectorRef, NgZone, OnChanges, SimpleChanges, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AnimationDirection, EasingType, MenuLink } from '../../models/types';
import { ANIMATION_DURATION } from '../../constants/animation.constants';
import { NavbarAnimationService } from '../../services/navbar-animation.service';
import { debugLog } from '../../enviroments/enviroments';
import { Subscription } from 'rxjs';

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
  @Input() maskBackground: string = '#87CEEB';
  @Input() showLoadingIndicator: boolean = true;
  @Input() loadingText: string = 'Loading...';

  // UI state
  isMenuOpen = false;
  showMask = false;
  isCovering = false;
  isUncovering = false;
  isAnimating = false;
  isButtonDisabled = false;

  // Private properties
  private buttonCooldownTimeout: ReturnType<typeof setTimeout> | null = null;
  private hamburgerButton: HTMLElement | null = null;
  private animationSubscription?: Subscription;

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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showNavbar'] && this.showNavbar) {
      this.revealNavbar();
    }
  }

  ngOnDestroy(): void {
    this.animationSubscription?.unsubscribe();
    if (this.buttonCooldownTimeout) {
      clearTimeout(this.buttonCooldownTimeout);
    }
    this.navbarAnimationService.cancelCurrentAnimation();
  }

  /**
   * Listen to animation state changes from the service
   */
  private setupAnimationListener(): void {
    this.animationSubscription = this.navbarAnimationService.animationState$.subscribe(state => {
      debugLog('📊 Animation state:', state.phase, `${(state.progress * 100).toFixed(0)}%`);

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

  /**
   * Reveal navbar after tile animation completes
   */
  private revealNavbar(): void {
    const hostElement = this.elementRef.nativeElement;
    this.renderer.addClass(hostElement, 'show-navbar');
    debugLog('✅ Navbar revealed');
  }

  /**
   * Toggle menu open/closed
   */
  toggleMenu(): void {
    if (this.isButtonDisabled || this.isAnimating) {
      debugLog('⚠️ Button disabled, ignoring click');
      return;
    }

    this.hamburgerButton = this.elementRef.nativeElement.querySelector('.hamburger-btn');

    if (!this.isMenuOpen) {
      debugLog('🔓 Opening menu');
      this.openMenu();
    } else {
      debugLog('🔒 Closing menu');
      this.closeMenu();
    }
  }

  /**
   * Open menu with diagonal wipe animation
   */
  private openMenu(): void {
    this.disableButtonTemporarily();
    this.isAnimating = true;
    document.body.style.overflow = 'hidden';

    // Preload route components for instant navigation
    this.preloadRouteComponents();

    // Run the cover → uncover animation
    this.navbarAnimationService.startNavigation(
      () => {
        // When screen is fully covered, show the menu
        debugLog('📍 Screen covered - displaying menu');
        this.isMenuOpen = true;
        this.cdr.detectChanges();
      },
      () => {
        // When animation completes
        debugLog('✅ Menu open animation complete');
        this.isAnimating = false;
        this.cdr.detectChanges();
      }
    );
  }

  /**
   * Preload lazy-loaded components by navigating without changing location
   */
  private preloadRouteComponents(): void {
    debugLog('🔄 Preloading route components...');

    this.menuLinks.forEach(link => {
      // Skip home route as it's already loaded
      if (link.route !== '/') {
        // Force router to load the component without navigating
        this.router.navigate([link.route], {
          skipLocationChange: true,
          replaceUrl: false
        }).then(() => {
          // Navigate back to current route silently
          this.router.navigate([this.router.url], {
            skipLocationChange: true,
            replaceUrl: false
          });
        });
      }
    });

    debugLog('✅ Route components preloaded');
  }

  /**
   * Close menu with diagonal wipe animation
   */
  closeMenu(): void {
    if (this.isButtonDisabled || this.isAnimating || !this.isMenuOpen) {
      debugLog('⚠️ Cannot close menu');
      return;
    }

    this.disableButtonTemporarily();
    this.isAnimating = true;

    // Run the cover → uncover animation
    this.navbarAnimationService.startNavigation(
      () => {
        // When screen is fully covered, hide the menu
        debugLog('📍 Screen covered - hiding menu');
        this.isMenuOpen = false;
        document.body.style.overflow = '';
        this.cdr.detectChanges();
      },
      () => {
        // When animation completes
        debugLog('✅ Menu close animation complete');
        this.isAnimating = false;
        this.cdr.detectChanges();
      }
    );
  }

  /**
   * Handle menu item click and navigation
   * Route changes when screen is fully covered
   */
  handleMenuClick(link: MenuLink, event: Event): void {
    event.preventDefault();

    if (this.isButtonDisabled || this.isAnimating) {
      debugLog('⚠️ Navigation blocked - animation in progress');
      return;
    }

    debugLog('🎯 Navigating to:', link.name, '→', link.route);

    this.disableButtonTemporarily();
    this.isAnimating = true;

    // Start diagonal wipe animation immediately
    this.navbarAnimationService.startNavigation(
      () => {
        // When screen is FULLY covered, navigate immediately
        debugLog('📍 Screen fully covered - navigating now');

        this.router.navigateByUrl(link.route).then(() => {
          window.scrollTo(0, 0);
          debugLog('✅ Route changed to →', link.route);
        });

        this.cdr.detectChanges();
      },
      () => {
        debugLog('✅ Wipe animation complete');
        this.isAnimating = false;
        this.cdr.detectChanges();
      }
    );

    // Keep menu overlay visible for 250ms, then close it
    setTimeout(() => {
      debugLog('📍 Closing menu overlay after 250ms');
      this.isMenuOpen = false;
      document.body.style.overflow = '';
      this.cdr.detectChanges();
    }, 250);
  }

  /**
   * Return focus to hamburger button after menu closes
   */
  private returnFocusToHamburger(): void {
    if (this.hamburgerButton && !this.isMenuOpen) {
      setTimeout(() => {
        (this.hamburgerButton as HTMLElement).focus();
        debugLog('🎯 Focus returned to hamburger button');
      }, 100);
    }
  }

  /**
   * Get CSS classes for the diagonal mask
   */
  getMaskClasses(): string {
    let classes = 'diagonal-mask';

    // Direction
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

    // Easing
    classes += ` ${this.animationEasing}`;

    // Animation state
    if (this.isCovering && !this.isUncovering) {
      classes += ' mask-covering';
    } else if (this.isUncovering) {
      classes += ' mask-uncovering';
    }

    return classes;
  }

  /**
   * Temporarily disable all interactive buttons
   */
  private disableButtonTemporarily(): void {
    this.isButtonDisabled = true;
    debugLog('🔒 Buttons disabled for', ANIMATION_DURATION.NAVBAR_COOLDOWN, 'ms');

    if (this.buttonCooldownTimeout) {
      clearTimeout(this.buttonCooldownTimeout);
    }

    this.buttonCooldownTimeout = setTimeout(() => {
      this.isButtonDisabled = false;
      debugLog('🔓 Buttons re-enabled');
      this.cdr.detectChanges();
    }, ANIMATION_DURATION.NAVBAR_COOLDOWN);
  }
}
