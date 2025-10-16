import { Component, Input, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { debugLog } from '../../enviroments/enviroments';

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
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showFooter'] && this.showFooter) {
      this.revealFooter();
    }
  }

  private revealFooter(): void {
    const hostElement = this.elementRef.nativeElement;
    this.renderer.addClass(hostElement, 'show-footer');
    debugLog('Footer now visible after tile animation');
  }

  onDatenschutzClick(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/datenschutz']);
  }

  onImpressumClick(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/impressum']);
  }
}
