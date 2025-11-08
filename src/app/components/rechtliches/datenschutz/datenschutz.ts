import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datenschutz',
  imports: [],
  standalone: true,
  templateUrl: './datenschutz.html',
  styleUrl: './datenschutz.css'
})
export class Datenschutz {
  constructor(private router: Router) {}

goBack(): void {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    this.router.navigate(['/']);
  }
}
}
