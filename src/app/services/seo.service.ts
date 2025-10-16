import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private meta: Meta,
    private titleService: Title
  ) {}

  updateTags(data: SeoData): void {
    if (data.title) {
      this.titleService.setTitle(data.title);
      this.meta.updateTag({ property: 'og:title', content: data.title });
      this.meta.updateTag({ name: 'twitter:title', content: data.title });
    }

    if (data.description) {
      this.meta.updateTag({ name: 'description', content: data.description });
      this.meta.updateTag({ property: 'og:description', content: data.description });
      this.meta.updateTag({ name: 'twitter:description', content: data.description });
    }

    if (data.image) {
      this.meta.updateTag({ property: 'og:image', content: data.image });
      this.meta.updateTag({ name: 'twitter:image', content: data.image });
    }

    if (data.url) {
      this.meta.updateTag({ property: 'og:url', content: data.url });
    }

    if (data.type) {
      this.meta.updateTag({ property: 'og:type', content: data.type });
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }

  setDefaults(): void {
    this.updateTags({
      title: 'PrestigioSolutions - Ihr IT Partner',
      description: 'Maßgeschneiderte IT-Lösungen für Ihr Unternehmen. Webseiten, Web Apps und IT-Beratung.',
      image: '/assets/images/PrestigioStolutionsLogo-removebg-preview.png',
      type: 'website'
    });
  }
}
