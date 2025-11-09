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
      color: '#667eea'
    },
    {
      title: 'Corporate Website',
      category: 'Web Design',
      description: 'Responsive Unternehmenswebsite mit CMS-Integration',
      color: '#f5576c'
    },
    {
      title: 'Dashboard Analytics',
      category: 'Data Visualization',
      description: 'Echtzeit-Dashboard für Business Intelligence',
      color: '#43e97b'
    },
    {
      title: 'AI Chatbot',
      category: 'Machine Learning',
      description: 'KI-gestützter Chatbot mit Natural Language Processing',
      color: '#fa709a'
    },
    {
      title: 'Booking System',
      category: 'SaaS Platform',
      description: 'Cloud-basiertes Buchungssystem für Hotels,Restaurants,Events und vieles mehr!',
      color: '#30cfd0'
    },
  ];

  projectImages = [
    'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80'
  ];

  getProjectImage(index: number): string {
    return this.projectImages[index] || '';
  }

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
