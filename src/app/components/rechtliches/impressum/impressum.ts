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
  if (window.history.length > 1) {
    window.history.back();
  } else {
    this.router.navigate(['/']);
  }
}
}
