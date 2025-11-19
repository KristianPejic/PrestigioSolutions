import { Component, Output, EventEmitter, OnDestroy, ElementRef, Renderer2, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

@Component({
  selector: 'app-magic-hat-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './magic-hat-animation.html',
  styleUrls: ['./magic-hat-animation.css']
})
export class MagicHatAnimation implements OnDestroy, OnChanges {
  @Input() hatRotating: boolean = false;
  @Input() nextSectionSelector: string = '.wer-wir-sind-section'; // Selector for target section
  @Output() animationComplete = new EventEmitter<void>();

  showHat = true;
  showCannonball = false;
  showSmoke = false;
  isAnimating = true;
  isRotated = false;
  smokeParticles: SmokeParticle[] = [];

  private animationTimeout?: ReturnType<typeof setTimeout>;
  private cannonballTimeout?: ReturnType<typeof setTimeout>;
  private smokeTimeout?: ReturnType<typeof setTimeout>;
  private impactTimeout?: ReturnType<typeof setTimeout>;
  private scrollTimeout?: ReturnType<typeof setTimeout>;
  private completeTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    // Smoke generation commented out
    // this.generateSmokeParticles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hatRotating'] && this.hatRotating) {
      // Start rotation
      this.isRotated = true;

      // After rotation completes, start the cannon animation
      setTimeout(() => {
        this.startAnimation();
      }, 1000); // Wait for rotation animation to complete
    }
  }

  ngOnDestroy(): void {
    if (this.animationTimeout) clearTimeout(this.animationTimeout);
    if (this.cannonballTimeout) clearTimeout(this.cannonballTimeout);
    if (this.smokeTimeout) clearTimeout(this.smokeTimeout);
    if (this.impactTimeout) clearTimeout(this.impactTimeout);
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    if (this.completeTimeout) clearTimeout(this.completeTimeout);
  }

  private generateSmokeParticles(): void {
    // Smoke generation commented out for now
    /*
    for (let i = 0; i < 25; i++) {
      this.smokeParticles.push({
        id: i,
        x: Math.random() * 80 - 40,
        y: 0,
        size: Math.random() * 50 + 30,
        delay: Math.random() * 0.3,
        duration: Math.random() * 0.8 + 0.8,
        opacity: Math.random() * 0.7 + 0.4
      });
    }
    */
  }

  private startAnimation(): void {
    // Step 1: After 500ms, shoot cannonball
    this.cannonballTimeout = setTimeout(() => {
      this.showCannonball = true;

      // Smoke commented out
      /*
      this.smokeTimeout = setTimeout(() => {
        this.showSmoke = true;

        setTimeout(() => {
          this.showSmoke = false;
        }, 1800);
      }, 50);
      */

      // Step 2: After cannonball reaches top (800ms - faster), trigger impact
      this.impactTimeout = setTimeout(() => {
        this.triggerImpact();

        // Step 3: Hide hat and cannonball after impact
        this.scrollTimeout = setTimeout(() => {
          this.showHat = false;
          this.showCannonball = false;

          // Step 4: Complete animation
          this.completeTimeout = setTimeout(() => {
            this.isAnimating = false;
            this.animationComplete.emit();
          }, 300);
        }, 400);
      }, 800); // Reduced from 1200ms to 800ms
    }, 500);
  }

  private triggerImpact(): void {
    // Shake effect on body
    const body = document.body;
    body.classList.add('shake-impact');

    // Remove shake class after animation
    setTimeout(() => {
      body.classList.remove('shake-impact');
    }, 600);

    // Calculate precise scroll distance to next section
    setTimeout(() => {
      this.scrollToNextSection();
    }, 200);
  }

  private scrollToNextSection(): void {
    // Try multiple possible selectors for the next section
    const possibleSelectors = [
      this.nextSectionSelector,
      '.wer-wir-sind-section',
      '#wer-wir-sind',
      '[data-section="wer-wir-sind"]',
      'app-wer-wir-sind',
      '.about-section',
      '.next-section'
    ];

    let targetElement: Element | null = null;

    // Find the first matching element
    for (const selector of possibleSelectors) {
      targetElement = document.querySelector(selector);
      if (targetElement) break;
    }

    if (targetElement) {
      // Get the element's position relative to viewport
      const targetRect = targetElement.getBoundingClientRect();
      const currentScrollY = window.scrollY || window.pageYOffset;

      // Calculate exact scroll distance needed
      // targetRect.top is relative to viewport, so add current scroll position
      const scrollDistance = targetRect.top + currentScrollY;

      // Account for any header offset (adjust this value if you have a fixed header)
      const headerOffset = 0; // Change to your header height if needed (e.g., 80)

      // Add a small boost to ensure we reach the section comfortably
      const scrollBoost = 50; // Extra pixels to push past the target slightly

      const finalScrollPosition = scrollDistance - headerOffset + scrollBoost;

      // Scroll to the exact position
      window.scrollTo({
        top: finalScrollPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback: Use dynamic viewport-based calculation
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const currentScroll = window.scrollY || window.pageYOffset;

      // Get zoom level to adjust scroll strength
      const zoomLevel = this.getZoomLevel();

      // Calculate scroll distance: use viewport height adjusted for zoom
      const baseScrollDistance = viewportHeight * 1.5; // Increased from 1.2 to 1.5 for stronger push
      const adjustedScrollDistance = baseScrollDistance / zoomLevel;

      // Make sure we don't scroll past the document
      const maxScroll = documentHeight - viewportHeight;
      const targetScroll = Math.min(currentScroll + adjustedScrollDistance, maxScroll);

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }

  private getZoomLevel(): number {
    // Method 1: Using devicePixelRatio (most reliable for browser zoom)
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Method 2: Compare window.innerWidth to document.documentElement.clientWidth
    const screenWidth = window.screen.width;
    const windowWidth = window.innerWidth;
    const ratio = screenWidth / windowWidth;

    // Use devicePixelRatio as it's more accurate for zoom detection
    // Values: 1 = 100%, 1.25 = 125%, 1.5 = 150%, etc.
    return devicePixelRatio;
  }

  trackBySmokeId(index: number, particle: SmokeParticle): number {
    return particle.id;
  }
}
