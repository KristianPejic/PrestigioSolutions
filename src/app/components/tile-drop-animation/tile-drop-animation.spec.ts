import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileDropAnimation } from './tile-drop-animation';

describe('TileDropAnimation', () => {
  let component: TileDropAnimation;
  let fixture: ComponentFixture<TileDropAnimation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileDropAnimation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileDropAnimation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
