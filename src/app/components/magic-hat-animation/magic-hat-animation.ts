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

    // Strong push to reach next component
    setTimeout(() => {
      window.scrollBy({
        top: 1000, // Increased to 1000px for stronger push
        behavior: 'smooth'
      });
    }, 200);
  }

  trackBySmokeId(index: number, particle: SmokeParticle): number {
    return particle.id;
  }
}
