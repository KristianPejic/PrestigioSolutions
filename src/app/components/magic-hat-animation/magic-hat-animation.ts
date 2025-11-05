import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-magic-hat-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './magic-hat-animation.html',
  styleUrls: ['./magic-hat-animation.css']
})
export class MagicHatAnimationComponent {
  @Output() animationComplete = new EventEmitter<void>();

  showHat = false;
  hatRotate = false;
  logoFired = false;
  logoLanded = false;

  startAnimation(): void {
    console.log('🎩 Magic hat animation started!');

    // Step 1: Show hat (200ms delay - SLOWER)
    setTimeout(() => {
      this.showHat = true;
      console.log('🎩 Hat appeared');
    }, 200);

    // Step 2: Rotate hat to aim at corner (900ms - SLOWER)
    setTimeout(() => {
      this.hatRotate = true;
      console.log('🎯 Hat rotating to aim at top-left');
    }, 900);

    // Step 3: Fire logo (2000ms - SLOWER)
    setTimeout(() => {
      this.logoFired = true;
      console.log('💥 Logo fired from hat!');
    }, 2000);

    // Step 4: Logo lands (3400ms - SLOWER to match 1.2s flight + bounce)
    setTimeout(() => {
      this.logoLanded = true;
      console.log('✅ Logo landed in corner');
      this.animationComplete.emit();
    }, 3400);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    console.log('📜 Scrolling to top');
  }

  reset(): void {
    this.showHat = false;
    this.hatRotate = false;
    this.logoFired = false;
    this.logoLanded = false;
  }
}
