import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/types';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css'
})
export class Portfolio {
  currentIndex = 0;

  projects: Project[] = [
    {
      title: 'E-Commerce Platform',
      category: 'Web Development',
      description: 'Moderne E-Commerce-Lösung mit integriertem Payment-System',
      tags: ['React', 'Node.js', 'MongoDB'],
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Corporate Website',
      category: 'Web Design',
      description: 'Responsive Unternehmenswebsite mit CMS-Integration',
      tags: ['Angular', 'TypeScript', 'Sass'],
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Mobile App',
      category: 'App Development',
      description: 'Cross-platform Mobile App für iOS und Android',
      tags: ['Flutter', 'Firebase', 'REST API'],
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: 'Dashboard Analytics',
      category: 'Data Visualization',
      description: 'Echtzeit-Dashboard für Business Intelligence',
      tags: ['Vue.js', 'D3.js', 'Python'],
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      title: 'AI Chatbot',
      category: 'Machine Learning',
      description: 'KI-gestützter Chatbot mit Natural Language Processing',
      tags: ['Python', 'TensorFlow', 'NLP'],
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      title: 'Booking System',
      category: 'SaaS Platform',
      description: 'Cloud-basiertes Buchungssystem für Hotels und Restaurants',
      tags: ['Laravel', 'Vue.js', 'MySQL'],
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    },
    {
      title: 'Fitness Tracker',
      category: 'Health & Fitness',
      description: 'Mobile App zum Tracking von Workouts und Ernährung',
      tags: ['React Native', 'Redux', 'GraphQL'],
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      title: 'Social Media Platform',
      category: 'Social Network',
      description: 'Social Media Plattform für kreative Künstler',
      tags: ['Next.js', 'PostgreSQL', 'AWS'],
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    {
      title: 'CRM System',
      category: 'Enterprise Software',
      description: 'Kundenbeziehungsmanagement-System für B2B-Unternehmen',
      tags: ['Java', 'Spring Boot', 'React'],
      color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    {
      title: 'Streaming Service',
      category: 'Video Platform',
      description: 'Video-on-Demand Streaming-Plattform mit Live-Streaming',
      tags: ['Node.js', 'WebRTC', 'Redis'],
      color: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
    }
  ];

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  getCardClass(index: number): string {
    const total = this.projects.length;
    const diff = (index - this.currentIndex + total) % total;

    if (diff === 0) return 'active';
    if (diff === 1 || diff === -total + 1) return 'next';
    if (diff === total - 1 || diff === -1) return 'prev';
    return '';
  }

  isCardVisible(index: number): boolean {
    const cardClass = this.getCardClass(index);
    return cardClass === 'active' || cardClass === 'prev' || cardClass === 'next';
  }
}
