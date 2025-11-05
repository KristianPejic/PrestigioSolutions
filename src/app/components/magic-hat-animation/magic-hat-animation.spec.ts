import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MagicHatAnimationComponent } from './magic-hat-animation';

describe('MagicHatAnimationComponent', () => {
  let component: MagicHatAnimationComponent;
  let fixture: ComponentFixture<MagicHatAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagicHatAnimationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MagicHatAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with all animation states as false', () => {
    expect(component.showHat).toBeFalse();
    expect(component.hatRotate).toBeFalse();
    expect(component.logoFired).toBeFalse();
    expect(component.logoLanded).toBeFalse();
  });

  it('should emit animationComplete when animation finishes', (done) => {
    component.animationComplete.subscribe(() => {
      expect(component.logoLanded).toBeTrue();
      done();
    });

    component.startAnimation();
  });

  it('should reset all states when reset is called', () => {
    component.showHat = true;
    component.hatRotate = true;
    component.logoFired = true;
    component.logoLanded = true;

    component.reset();

    expect(component.showHat).toBeFalse();
    expect(component.hatRotate).toBeFalse();
    expect(component.logoFired).toBeFalse();
    expect(component.logoLanded).toBeFalse();
  });
});
