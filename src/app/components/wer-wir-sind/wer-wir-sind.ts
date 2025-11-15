import { Component, HostListener, OnInit, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Debounce } from '../../utils/decorators';

interface Particle {
  x: number;
  y: number;
  floatX: string;
  floatY: string;
  delay: string;
}

@Component({
  selector: 'app-wer-wir-sind',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wer-wir-sind.html',
  styleUrls: ['./wer-wir-sind.css']
})
export class WerWirSindComponent implements OnInit, OnDestroy {
  @Output() lineExtended = new EventEmitter<boolean>();

  isAnimated = false;
  activeWordIndex = -1;
  particles: Particle[] = [];

  private wordTimers: any[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.generateParticles();
    this.checkScrollPosition();
  }

  ngOnDestroy(): void {
    this.clearWordTimers();
  }

  private generateParticles(): void {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        floatX: `${(Math.random() - 0.5) * 100}px`,
        floatY: `${(Math.random() - 0.5) * 100}px`,
        delay: `${Math.random() * 3}s`
      });
    }
  }

  @HostListener('window:scroll', [])
  @Debounce(16)
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const isVisible = rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.3;
    const isAbove = rect.top > windowHeight * 0.7;

    if (isVisible && !this.isAnimated) {
      this.isAnimated = true;
      this.startWordAnimation();
      this.lineExtended.emit(true);
    } else if (isAbove && this.isAnimated) {
      this.isAnimated = false;
      this.activeWordIndex = -1;
      this.clearWordTimers();
      this.lineExtended.emit(false);
    }
  }

  private startWordAnimation(): void {
    this.clearWordTimers();

    // WER becomes blue
    const timer1 = setTimeout(() => {
      this.activeWordIndex = 0;
    }, 0);
    this.wordTimers.push(timer1);

    // WIR becomes blue, WER becomes white
    const timer2 = setTimeout(() => {
      this.activeWordIndex = 1;
    }, 800);
    this.wordTimers.push(timer2);

    // SIND becomes blue, WER and WIR become white
    const timer3 = setTimeout(() => {
      this.activeWordIndex = 2;
    }, 1600);
    this.wordTimers.push(timer3);
  }

  private clearWordTimers(): void {
    this.wordTimers.forEach(timer => clearTimeout(timer));
    this.wordTimers = [];
  }
}
