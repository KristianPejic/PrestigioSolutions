import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UberUns } from './uber-uns';

describe('UberUns', () => {
  let component: UberUns;
  let fixture: ComponentFixture<UberUns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UberUns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UberUns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
