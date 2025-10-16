import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ANIMATION_DURATION } from '../constants/animation.constants';
import { debugLog } from '../enviroments/enviroments';

export interface AnimationState {
  isAnimating: boolean;
  phase: 'idle' | 'covering' | 'covered' | 'uncovering' | 'complete';
  progress: number;
}

@Injectable({
  providedIn: 'root'
})
export class NavbarAnimationService {
  private animationState = new BehaviorSubject<AnimationState>({
    isAnimating: false,
    phase: 'idle',
    progress: 0
  });

  public animationState$ = this.animationState.asObservable();

  private currentAnimation: {
    coverTimeout?: ReturnType<typeof setTimeout>;
    coveredTimeout?: ReturnType<typeof setTimeout>;
    uncoverTimeout?: ReturnType<typeof setTimeout>;
    completeTimeout?: ReturnType<typeof setTimeout>;
  } = {};

  constructor(private ngZone: NgZone) {}

  startNavigation(onCovered: () => void, onComplete: () => void): void {
    this.cancelCurrentAnimation();

    this.updateState({ isAnimating: true, phase: 'idle', progress: 0 });
    debugLog('🎬 Starting navigation animation');

    this.ngZone.runOutsideAngular(() => {
      this.currentAnimation.coverTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          this.updateState({ isAnimating: true, phase: 'covering', progress: 0.33 });
          debugLog('📍 Phase: Covering screen (smooth diagonal)');
        });
      }, 50);

      const coverCompleteTime = 50 + ANIMATION_DURATION.NAVBAR_MASK + 100;
      this.currentAnimation.coveredTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          this.updateState({ isAnimating: true, phase: 'covered', progress: 0.5 });
          debugLog('📍 Phase: Screen FULLY covered - executing navigation');
          onCovered();
        });
      }, coverCompleteTime);

      const uncoverStartTime = coverCompleteTime + 300;
      this.currentAnimation.uncoverTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          this.updateState({ isAnimating: true, phase: 'uncovering', progress: 0.75 });
          debugLog('📍 Phase: Uncovering screen (smooth diagonal)');
        });
      }, uncoverStartTime);

      const completeTime = uncoverStartTime + ANIMATION_DURATION.NAVBAR_MASK + 100;
      this.currentAnimation.completeTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          this.updateState({ isAnimating: false, phase: 'complete', progress: 1 });
          debugLog('✅ Animation complete');
          onComplete();
        });
      }, completeTime);
    });
  }

  cancelCurrentAnimation(): void {
    if (this.currentAnimation.coverTimeout) clearTimeout(this.currentAnimation.coverTimeout);
    if (this.currentAnimation.coveredTimeout) clearTimeout(this.currentAnimation.coveredTimeout);
    if (this.currentAnimation.uncoverTimeout) clearTimeout(this.currentAnimation.uncoverTimeout);
    if (this.currentAnimation.completeTimeout) clearTimeout(this.currentAnimation.completeTimeout);

    this.currentAnimation = {};
    debugLog('🛑 Animation cancelled');
  }

  private updateState(partial: Partial<AnimationState>): void {
    const current = this.animationState.value;
    this.animationState.next({ ...current, ...partial });
  }

  getCurrentState(): AnimationState {
    return this.animationState.value;
  }

  isAnimating(): boolean {
    return this.animationState.value.isAnimating;
  }
}
