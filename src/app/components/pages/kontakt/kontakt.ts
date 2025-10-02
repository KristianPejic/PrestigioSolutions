import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-kontakt',
  templateUrl: './kontakt.html',
  styleUrls: ['./kontakt.css'],
  imports: [CommonModule]
})
export class Kontakt {
  emailCategories = [
    {
      category: 'Allgemeine Anfragen',
      icon: 'fa-solid fa-envelope',
      emails: [
        { address: 'info@prestigiosolutions.com', label: 'Allgemeine Informationen', copied: false },
        { address: 'hallo@prestigiosolutions.com', label: 'Deutsch', copied: false },
        { address: 'hello@prestigiosolutions.com', label: 'English', copied: false },
        { address: 'kontakt@prestigiosolutions.com', label: 'Kontakt', copied: false }
      ],
      color: '#3b82f6'
    },
    {
      category: 'Support & Technik',
      icon: 'fa-solid fa-wrench',
      emails: [
        { address: 'support@prestigiosolutions.com', label: 'Kundensupport', copied: false },
        { address: 'it@prestigiosolutions.com', label: 'IT-Abteilung', copied: false },
        { address: 'technik@prestigiosolutions.com', label: 'Technischer Support', copied: false }
      ],
      color: '#10b981'
    },
    {
      category: 'Verwaltung',
      icon: 'fa-solid fa-briefcase',
      emails: [
        { address: 'buchhaltung@prestigiosolutions.com', label: 'Buchhaltung', copied: false }
      ],
      color: '#f59e0b'
    },
    {
      category: 'Rechtliches',
      icon: 'fa-solid fa-gavel',
      emails: [
        { address: 'datenschutz@prestigiosolutions.com', label: 'Datenschutz', copied: false },
        { address: 'impressum@prestigiosolutions.com', label: 'Impressum', copied: false },
        { address: 'recht@prestigiosolutions.com', label: 'Rechtsabteilung', copied: false }
      ],
      color: '#8b5cf6'
    }
  ];

  address = 'Musterstraße 123, 12345 Musterstadt';
  phone = '+49 123 4567890';

  copyToClipboard(email: any): void {
    navigator.clipboard.writeText(email.address).then(() => {
      email.copied = true; // show check icon
      setTimeout(() => email.copied = false, 2000); // revert after 2s
    });
  }
}
