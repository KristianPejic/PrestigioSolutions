import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagicHatAnimation } from './magic-hat-animation';

describe('MagicHatAnimation', () => {
  let component: MagicHatAnimation;
  let fixture: ComponentFixture<MagicHatAnimation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagicHatAnimation]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MagicHatAnimation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
