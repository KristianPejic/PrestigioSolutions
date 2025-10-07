import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearAnimation } from './year-animation';

describe('YearAnimation', () => {
  let component: YearAnimation;
  let fixture: ComponentFixture<YearAnimation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearAnimation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearAnimation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
