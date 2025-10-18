import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLink } from '../../../models/types';

@Component({
  selector: 'app-socials',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './socials.html',
  styleUrl: './socials.css'
})
export class Socials {
  socials: SocialLink[] = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/prestigio-solutions-b4325338b/',
      icon: 'fa-brands fa-linkedin',
      color: 'linear-gradient(135deg, #0077b5, #00a0dc)',
      description: 'Vernetzen Sie sich mit uns professionell und erfahren Sie mehr über unsere Projekte und Erfolge'
    },
    {
      name: 'X',
      url: 'https://x.com/prestigiosol',
      icon: 'fa-brands fa-x-twitter',
      color: 'linear-gradient(135deg, #1da1f2, #14a1f0)',
      description: 'Bleiben Sie auf dem Laufenden mit unseren neuesten Updates, Insights und Branchennews'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/prestigiosolutions/',
      icon: 'fa-brands fa-instagram',
      color: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af)',
      description: 'Erleben Sie visuelle Einblicke hinter die Kulissen und unsere kreative Seite'
    }
  ];
}
