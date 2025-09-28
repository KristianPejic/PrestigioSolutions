import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortServices } from './short-services';

describe('ShortServices', () => {
  let component: ShortServices;
  let fixture: ComponentFixture<ShortServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
