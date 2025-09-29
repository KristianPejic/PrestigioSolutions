import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { WerWirSindComponent } from './components/wer-wir-sind/wer-wir-sind';
import { ImageRevealComponent } from './components/image-reveal/image-reveal';
import { ShortServices } from './components/short-services/short-services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroComponent,
    WerWirSindComponent,
    ImageRevealComponent,
    ShortServices
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'PrestigioSolutions';
  isLineExtended = false;

  onLineExtended(extended: boolean): void {
    this.isLineExtended = extended;
    console.log('Line extended:', extended);
  }

  onImageRevealed(): void {
    console.log('Image revealed!');
    // You can add additional logic here when image is revealed
  }
}
