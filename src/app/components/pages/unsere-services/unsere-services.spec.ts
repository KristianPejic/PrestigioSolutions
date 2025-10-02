import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsereServices } from './unsere-services';

describe('UnsereServices', () => {
  let component: UnsereServices;
  let fixture: ComponentFixture<UnsereServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsereServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsereServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
