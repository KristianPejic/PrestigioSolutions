import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NavbarAnimationService } from '../../services/navbar-animation.service';

@Component({
  selector: 'app-route-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `route-loader.html`,
  styleUrls: ['route-loader.css']
})
export class RouteLoaderComponent {
  isLoading = false;
  loadingMessage = 'Loading...';

  constructor(
    private router: Router,
    private navbarAnimationService: NavbarAnimationService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.navbarAnimationService.isAnimating()) {
          this.isLoading = true;
          this.loadingMessage = 'Loading...';
        }
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      }
    });
  }
}
