import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Portfolio } from './portfolio';

describe('Portfolio', () => {
  let component: Portfolio;
  let fixture: ComponentFixture<Portfolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Portfolio]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Portfolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 projects', () => {
    expect(component.projects.length).toBe(4);
  });

  it('should start at index 0', () => {
    expect(component.currentIndex).toBe(0);
  });

  it('should navigate to next slide', () => {
    component.nextSlide();
    expect(component.currentIndex).toBe(1);
  });

  it('should navigate to previous slide', () => {
    component.currentIndex = 2;
    component.prevSlide();
    expect(component.currentIndex).toBe(1);
  });

  it('should not go below index 0', () => {
    component.currentIndex = 0;
    component.prevSlide();
    expect(component.currentIndex).toBe(0);
  });

  it('should not exceed max index', () => {
    component.currentIndex = 3;
    component.nextSlide();
    expect(component.currentIndex).toBe(3);
  });

  it('should jump to specific slide', () => {
    component.goToSlide(2);
    expect(component.currentIndex).toBe(2);
  });
});
