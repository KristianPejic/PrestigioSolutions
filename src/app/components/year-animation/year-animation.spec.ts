import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearAnimationComponent } from './year-animation';

describe('YearAnimation', () => {
  let component: YearAnimationComponent;
  let fixture: ComponentFixture<YearAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearAnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
