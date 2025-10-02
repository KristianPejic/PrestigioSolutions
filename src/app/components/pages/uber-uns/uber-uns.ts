import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-uber-uns',
  imports: [],
  standalone: true,
  templateUrl: './uber-uns.html',
  styleUrl: './uber-uns.css'
})
export class UberUns implements OnInit, AfterViewInit {

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Initialize counter animation for stats
    this.initCounterAnimation();

    // Initialize scroll animations
    this.initScrollAnimations();
  }

  private initCounterAnimation(): void {
    const statNumbers = this.el.nativeElement.querySelectorAll('.stat-number');

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const targetValue = parseInt(target.getAttribute('data-target') || '0');
          this.animateCounter(target, targetValue);
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    statNumbers.forEach((stat: Element) => {
      observer.observe(stat);
    });
  }

  private animateCounter(element: HTMLElement, target: number): void {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toString() + (target === 98 ? '%' : '+');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toString() + (target === 98 ? '%' : '+');
      }
    }, stepTime);
  }

  private initScrollAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const elements = this.el.nativeElement.querySelectorAll(
      '.mission-card, .team-member, .timeline-item, .stat-item'
    );

    elements.forEach((el: Element) => {
      observer.observe(el);
    });
  }
}
