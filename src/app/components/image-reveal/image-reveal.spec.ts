import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageReveal } from './image-reveal';

describe('ImageReveal', () => {
  let component: ImageReveal;
  let fixture: ComponentFixture<ImageReveal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageReveal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageReveal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
