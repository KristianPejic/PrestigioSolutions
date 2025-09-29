import { Component, Input, ChangeDetectorRef, NgZone, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AnimationDirection = 'top-right-to-bottom-left' | 'top-left-to-bottom-right' | 'bottom-left-to-top-right' | 'bottom-right-to-top-left';
export type EasingType = 'smooth' | 'bouncy' | 'sharp' | 'elastic';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnChanges {
  @Input() showNavbar = false; // Controlled by parent
  @Input() animationDirection: AnimationDirection = 'top-right-to-bottom-left';
  @Input() animationEasing: EasingType = 'smooth';
  @Input() animationDuration: number = 1400;
  @Input() pauseDuration: number = 20;
  @Input() maskBackground: string = '#87CEEB';
  @Input() showLoadingIndicator: boolean = false;
  @Input() loadingText: string = 'Loading Menu...';

  // Menu and animation state
  isMenuOpen = false;
  showMask = false;
  isCovering = false;
  isUncovering = false;
  isAnimating = false;
  isButtonDisabled = false;

  // Track current animation timeouts to clear them
  private currentTimeouts: any[] = [];
  private buttonCooldownTimeout: any;

  menuLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
    { name: 'Socials', href: '#socials' }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showNavbar']) {
      if (this.showNavbar) {
        this.revealNavbar();
      }
    }
  }

  private revealNavbar(): void {
    const hostElement = this.elementRef.nativeElement;
    this.renderer.addClass(hostElement, 'show-navbar');
    console.log('Navbar now visible after tile animation');
  }

  toggleMenu(): void {
    // Check if button is disabled due to cooldown or animation
    if (this.isButtonDisabled || this.isAnimating) {
      console.log('Button disabled, ignoring click - isButtonDisabled:', this.isButtonDisabled, 'isAnimating:', this.isAnimating);
      return;
    }

    // Disable button for 2.5 seconds to prevent rapid clicking
    this.disableButtonTemporarily();

    if (!this.isMenuOpen) {
      // Opening menu
      console.log('Opening menu');
      this.startMenuOpenAnimation();
    } else {
      // Closing menu
      console.log('Closing menu');
      this.startMenuCloseAnimation();
    }
  }

  handleMenuClick(link: any, event: Event): void {
    event.preventDefault();

    // Check if interactions are disabled
    if (this.isButtonDisabled || this.isAnimating) {
      console.log('Menu item disabled, ignoring click');
      return;
    }

    console.log('Navigating to:', link.name);
    this.closeMenu();
    // Add your routing logic here
    // this.router.navigate([link.href]);
  }

  closeMenu(): void {
    // Check if button is disabled due to cooldown or animation
    if (this.isButtonDisabled || this.isAnimating) {
      console.log('Close button disabled, ignoring click - isButtonDisabled:', this.isButtonDisabled, 'isAnimating:', this.isAnimating);
      return;
    }
    if (!this.isMenuOpen) {
      console.log('Menu already closed, ignoring close');
      return;
    }

    // Disable button for 2.5 seconds to prevent rapid clicking
    this.disableButtonTemporarily();

    console.log('Closing menu via close button');
    this.startMenuCloseAnimation();
  }

  // Animation when opening menu
  private startMenuOpenAnimation(): void {
    this.isAnimating = true;
    this.showMask = true;
    this.isCovering = false;
    this.isUncovering = false;

    console.log('Starting menu open animation');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    this.ngZone.runOutsideAngular(() => {
      // Small delay then start covering
      setTimeout(() => {
        this.ngZone.run(() => {
          this.isCovering = true;
          this.cdr.detectChanges();
        });
      }, 50);

      // After covering is complete, show menu and enable interactions
      const coverCompleteTime = 50 + this.animationDuration + 100;
      setTimeout(() => {
        this.ngZone.run(() => {
          console.log('Screen covered - showing menu');
          this.isMenuOpen = true;
          this.isAnimating = false; // Enable buttons as soon as menu appears
          this.cdr.detectChanges();
        });
      }, coverCompleteTime);

      // Start uncovering to reveal menu
      const uncoverStartTime = coverCompleteTime + this.pauseDuration;
      setTimeout(() => {
        this.ngZone.run(() => {
          this.isUncovering = true;
          this.cdr.detectChanges();
        });
      }, uncoverStartTime);

      // Animation complete - just cleanup
      const totalTime = uncoverStartTime + this.animationDuration + 100;
      setTimeout(() => {
        this.ngZone.run(() => {
          this.showMask = false;
          this.isCovering = false;
          this.isUncovering = false;
          // isAnimating already set to false earlier
          console.log('Menu open animation complete - cleanup');
          this.cdr.detectChanges();
        });
      }, totalTime);
    });
  }

  // Animation when closing menu
  private startMenuCloseAnimation(): void {
    this.isAnimating = true;
    this.showMask = true;
    this.isCovering = false;
    this.isUncovering = false;

    console.log('Starting menu close animation');

    this.ngZone.runOutsideAngular(() => {
      // Start covering to hide menu
      setTimeout(() => {
        this.ngZone.run(() => {
          this.isCovering = true;
          this.cdr.detectChanges();
        });
      }, 50);

      // After covering, hide menu
      const coverCompleteTime = 50 + this.animationDuration + 100;
      setTimeout(() => {
        this.ngZone.run(() => {
          console.log('Screen covered - hiding menu');
          this.isMenuOpen = false;
          this.cdr.detectChanges();
        });
      }, coverCompleteTime);

      // Start uncovering to reveal main content
      const uncoverStartTime = coverCompleteTime + this.pauseDuration;
      setTimeout(() => {
        this.ngZone.run(() => {
          this.isUncovering = true;
          this.cdr.detectChanges();
        });
      }, uncoverStartTime);

      // Animation complete
      const totalTime = uncoverStartTime + this.animationDuration + 100;
      setTimeout(() => {
        this.ngZone.run(() => {
          this.showMask = false;
          this.isCovering = false;
          this.isUncovering = false;
          this.isAnimating = false;

          // Restore body scroll
          document.body.style.overflow = '';

          console.log('Menu close animation complete');
          this.cdr.detectChanges();
        });
      }, totalTime);
    });
  }

  getMaskClasses(): string {
    let classes = 'diagonal-mask';

    // Add direction class
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

    // Add easing class
    classes += ` ${this.animationEasing}`;

    // Add state classes
    if (this.isCovering && !this.isUncovering) {
      classes += ' mask-covering';
    } else if (this.isUncovering) {
      classes += ' mask-uncovering';
    }

    return classes;
  }

  // Helper method to disable button temporarily for 2+ seconds
  private disableButtonTemporarily(): void {
    this.isButtonDisabled = true;
    console.log('All buttons disabled for 2.5 seconds');

    // Clear any existing cooldown timeout
    if (this.buttonCooldownTimeout) {
      clearTimeout(this.buttonCooldownTimeout);
    }

    // Re-enable button after 2.5 seconds
    this.buttonCooldownTimeout = setTimeout(() => {
      this.isButtonDisabled = false;
      console.log('All buttons re-enabled after 2.5 seconds');
      this.cdr.detectChanges();
    }, 2500);
  }
}
