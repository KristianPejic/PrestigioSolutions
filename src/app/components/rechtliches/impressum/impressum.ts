import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-impressum',
  imports: [],
  standalone: true,
  templateUrl: './impressum.html',
  styleUrl: './impressum.css'
})
export class Impressum {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/'], {
      skipLocationChange: false,
      replaceUrl: false
    });
  }
}
