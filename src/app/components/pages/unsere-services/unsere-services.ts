import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-unsere-services',
  imports: [],
  standalone: true,
  templateUrl: './unsere-services.html',
  styleUrl: './unsere-services.css'
})
export class UnsereServices implements OnInit, AfterViewInit {

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Initialize scroll animations
    this.initScrollAnimations();
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
      '.service-detail-card, .process-step, .feature-item'
    );

    elements.forEach((el: Element) => {
      observer.observe(el);
    });
  }
}
