import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-wer-wir-sind',
  templateUrl: './wer-wir-sind.html',
  styleUrls: ['./wer-wir-sind.css']
})
export class WerWirSindComponent implements OnInit {
  lines: any[] = [
    { position: '38%' },
    { position: '50%' },
    { position: '62%' }
  ];

  ngOnInit(): void {
    this.updateLineHeights();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.updateLineHeights();
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    this.updateLineHeights();
  }

  private updateLineHeights(): void {
    // This will be handled by the CSS in a more Angular-way
    // The scroll effect is better implemented with pure CSS for performance
  }
}
