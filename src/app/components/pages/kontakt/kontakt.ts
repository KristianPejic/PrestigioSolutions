import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-kontakt',
  templateUrl: './kontakt.html',
  styleUrls: ['./kontakt.css'],
  imports: [FormsModule]
})
export class Kontakt {
 formData = { name: '', email: '', message: '' };

  onSubmit() {
    console.log('Form submitted:', this.formData);
    alert('Vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.');
    this.formData = { name: '', email: '', message: '' };
  }
}
