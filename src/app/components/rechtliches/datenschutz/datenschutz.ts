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
    this.router.navigate(['/'], {
      skipLocationChange: false,
      replaceUrl: false
    });
  }
}
