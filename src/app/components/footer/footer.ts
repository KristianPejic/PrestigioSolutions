import { Component, Input, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent implements OnChanges {
  @Input() showFooter: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showFooter'] && this.showFooter) {
      this.revealFooter();
    }
  }

  private revealFooter(): void {
    const hostElement = this.elementRef.nativeElement;
    this.renderer.addClass(hostElement, 'show-footer');
    console.log('Footer now visible after tile animation');
  }

  onDatenschutzClick(event: Event): void {
    event.preventDefault();
    console.log('Datenschutz clicked');
    // Add your navigation logic here later
    // this.router.navigate(['/datenschutz']);
  }

  onImpressumClick(event: Event): void {
    event.preventDefault();
    console.log('Impressum clicked');
    // Add your navigation logic here later
    // this.router.navigate(['/impressum']);
  }
}
