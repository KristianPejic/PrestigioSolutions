import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WerWirSind } from './wer-wir-sind';

describe('WerWirSind', () => {
  let component: WerWirSind;
  let fixture: ComponentFixture<WerWirSind>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WerWirSind]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WerWirSind);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
