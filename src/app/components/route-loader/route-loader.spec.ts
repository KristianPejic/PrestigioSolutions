import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteLoader } from './route-loader';

describe('RouteLoader', () => {
  let component: RouteLoader;
  let fixture: ComponentFixture<RouteLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
