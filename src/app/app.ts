import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { WerWirSindComponent } from './components/wer-wir-sind/wer-wir-sind';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroComponent, WerWirSindComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  showWerWirSind = false; // becomes true when full animation completes
  isMenuOpen = false;     // controlled via menu toggle
}
