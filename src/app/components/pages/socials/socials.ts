import { Component } from '@angular/core';

@Component({
  selector: 'app-socials',
  imports: [],
  standalone:true,
  templateUrl: './socials.html',
  styleUrl: './socials.css'
})
export class Socials {
socials = [
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼', color: 'linear-gradient(135deg, #0077b5, #00a0dc)', description: 'Vernetzen Sie sich mit uns auf LinkedIn' },
    { name: 'GitHub', url: 'https://github.com', icon: '🐙', background: 'linear-gradient(135deg, #333, #666)', description: 'Sehen Sie unsere Open-Source-Projekte' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦', color: 'linear-gradient(135deg, #1da1f2, #14a1f0)', description: 'Folgen Sie uns für Updates und News' },
    { name: 'Instagram', url: 'https://instagram.com', icon: '📷', color: 'linear-gradient(135deg, #f58529, #dd2a7b)', description: 'Einblicke hinter die Kulissen' }
  ];
}
