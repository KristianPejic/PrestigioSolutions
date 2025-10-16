import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import {
  provideRouter,
  withViewTransitions,
  withInMemoryScrolling,
  PreloadAllModules,
  withPreloading
} from '@angular/router';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './services/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withViewTransitions({
        skipInitialTransition: false,
        onViewTransitionCreated: ({ transition }) => {
        }
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
