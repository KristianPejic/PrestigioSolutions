import { Component } from '@angular/core';
import { TileDropAnimationComponent } from './components/tile-drop-animation/tile-drop-animation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TileDropAnimationComponent],
  template: `
    <app-tile-drop-animation></app-tile-drop-animation>
  `,
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'PrestigioSolutions';
}
