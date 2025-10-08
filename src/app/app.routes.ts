import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'uber-uns',
    loadComponent: () =>
      import('./components/pages/uber-uns/uber-uns').then(
        (m) => m.UberUns
      ),
    title: 'Über Uns - Ihr IT Partner'
  },
  {
    path: 'unsere-services',
    loadComponent: () =>
      import('./components/pages/unsere-services/unsere-services').then(
        (m) => m.UnsereServices
      ),
    title: 'Unsere Services - Ihr IT Partner'
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('./components/pages/portfolio/portfolio').then(
        (m) => m.Portfolio
      ),
    title: 'Portfolio - Ihr IT Partner'
  },
  {
    path: 'kontakt',
    loadComponent: () =>
      import('./components/pages/kontakt/kontakt').then(
        (m) => m.Kontakt
      ),
    title: 'Kontakt - Ihr IT Partner'
  },
  {
    path: 'socials',
    loadComponent: () =>
      import('./components/pages/socials/socials').then(
        (m) => m.Socials
      ),
    title: 'Socials - Ihr IT Partner'
  },
{
    path: 'impressum',
    loadComponent: () => import('./components/rechtliches/impressum/impressum').then(m => m.Impressum),
    title: 'Impressum'
  },
  {
    path: 'datenschutz',
    loadComponent: () => import('./components/rechtliches/datenschutz/datenschutz').then(m => m.Datenschutz),
    title: 'Datenschutz'
  },
];
