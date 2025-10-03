import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
@Component({
  selector: 'app-portfolio',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css'
})
export class Portfolio {
 projects = [
    { title: 'E-Commerce Platform', category: 'Web Development', description: 'Moderne E-Commerce-Lösung mit integriertem Payment-System', tags: ['React', 'Node.js', 'MongoDB'], color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: 'Corporate Website', category: 'Web Design', description: 'Responsive Unternehmenswebsite mit CMS-Integration', tags: ['Angular', 'TypeScript', 'Sass'], color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { title: 'Mobile App', category: 'App Development', description: 'Cross-platform Mobile App für iOS und Android', tags: ['Flutter', 'Firebase', 'REST API'], color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { title: 'Dashboard Analytics', category: 'Data Visualization', description: 'Echtzeit-Dashboard für Business Intelligence', tags: ['Vue.js', 'D3.js', 'Python'], color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
  ];
}
