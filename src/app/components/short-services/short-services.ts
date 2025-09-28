import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-short-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './short-services.html',
  styleUrls: ['./short-services.css']
})
export class ShortServices {
  // Data for the 4 service cards
  services = [
    {
      key: 'webseiten',
      title: 'Webseiten',
      subtitle: 'Moderne Webseiten',
      description: [
        'Responsives Design',
        'SEO-optimiert',
        'Schnelle Ladezeiten'
      ]
    },
    {
      key: 'webapps',
      title: 'Web Apps',
      subtitle: 'Individuelle Web-Apps',
      description: [
        'Progressive Web Apps',
        'Sichere Architekturen',
        'Cloud-Integration'
      ]
    },
    {
      key: 'prozess',
      title: 'Prozess & Kosten',
      subtitle: 'Optimierung',
      description: [
        'Automatisierung',
        'Effizienzsteigerung',
        'Kostenreduktion'
      ]
    },
    {
      key: 'itberatung',
      title: 'IT-Beratung',
      subtitle: 'Strategische Beratung',
      description: [
        'Individuelle IT-Strategien',
        'Technologie-Roadmaps',
        'Digitale Transformation'
      ]
    }
  ];
}
