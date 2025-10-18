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

  isMenuOpen = false;
  showMask = false;
  isCovering = false;
  isUncovering = false;
  isAnimating = false;
  isButtonDisabled = false;

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

  private revealNavbar(): void {
    const hostElement = this.elementRef.nativeElement;
    this.renderer.addClass(hostElement, 'show-navbar');
    debugLog('✅ Navbar revealed');
  }

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

  private openMenu(): void {
    this.disableButtonTemporarily();
    this.isAnimating = true;
    document.body.style.overflow = 'hidden';

    this.preloadRouteComponents();

    this.navbarAnimationService.startNavigation(
      () => {
        debugLog('📍 Screen covered - displaying menu');
        this.isMenuOpen = true;
        this.cdr.detectChanges();
      },
      () => {
        debugLog('✅ Menu open animation complete');
        this.isAnimating = false;
        this.cdr.detectChanges();
      }
    );
  }

  private preloadRouteComponents(): void {
    debugLog('🔄 Preloading route components...');

    this.menuLinks.forEach(link => {
      if (link.route !== '/') {
        this.router.navigate([link.route], {
          skipLocationChange: true,
          replaceUrl: false
        }).then(() => {
          this.router.navigate([this.router.url], {
            skipLocationChange: true,
            replaceUrl: false
          });
        });
      }
    });

    debugLog('✅ Route components preloaded');
  }

  closeMenu(): void {
    if (this.isButtonDisabled || this.isAnimating || !this.isMenuOpen) {
      debugLog('⚠️ Cannot close menu');
      return;
    }

    this.disableButtonTemporarily();
    this.isAnimating = true;

    this.navbarAnimationService.startNavigation(
      () => {
        debugLog('📍 Screen covered - hiding menu');
        this.isMenuOpen = false;
        document.body.style.overflow = '';
        this.cdr.detectChanges();
      },
      () => {
        debugLog('✅ Menu close animation complete');
        this.isAnimating = false;
        this.cdr.detectChanges();
      }
    );
  }

  handleMenuClick(link: MenuLink, event: Event): void {
    event.preventDefault();

    if (this.isButtonDisabled || this.isAnimating) {
      debugLog('⚠️ Navigation blocked - animation in progress');
      return;
    }

    debugLog('🎯 Navigating to:', link.name, '→', link.route);

    this.disableButtonTemporarily();
    this.isAnimating = true;

    this.navbarAnimationService.startNavigation(
      () => {
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

    setTimeout(() => {
      debugLog('📍 Closing menu overlay after 250ms');
      this.isMenuOpen = false;
      document.body.style.overflow = '';
      this.cdr.detectChanges();
    }, 250);
  }

  private returnFocusToHamburger(): void {
    if (this.hamburgerButton && !this.isMenuOpen) {
      setTimeout(() => {
        (this.hamburgerButton as HTMLElement).focus();
        debugLog('🎯 Focus returned to hamburger button');
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
  onLogoClick(event: Event): void {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }
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
