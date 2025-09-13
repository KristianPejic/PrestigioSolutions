import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroComponent],
  template: `
    <app-hero></app-hero>
  `,
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'PrestigioSolutions';
}
