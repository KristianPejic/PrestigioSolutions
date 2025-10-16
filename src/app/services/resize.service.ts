import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, shareReplay, startWith } from 'rxjs/operators';

export interface ScreenSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  readonly resize$: Observable<ScreenSize>;

  constructor() {
    this.resize$ = fromEvent(window, 'resize').pipe(
      debounceTime(150),
      startWith(null),
      map(() => this.getCurrentScreenSize()),
      shareReplay(1)
    );
  }

  getCurrentScreenSize(): ScreenSize {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      width,
      height,
      isMobile: width <= 768,
      isTablet: width > 768 && width <= 1024,
      isDesktop: width > 1024
    };
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  isTablet(): boolean {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }

  isDesktop(): boolean {
    return window.innerWidth > 1024;
  }
}
