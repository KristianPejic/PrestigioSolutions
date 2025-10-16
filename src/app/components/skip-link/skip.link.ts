import { Component } from '@angular/core';

@Component({
  selector: 'app-skip-link',
  standalone: true,
  template: `
    <a href="#main-content" class="skip-link">
      Skip to main content
    </a>
  `,
  styles: []
})
export class SkipLinkComponent {}
