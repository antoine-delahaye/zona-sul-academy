import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Routes } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { navigationRoutes, legalRoutes } from './app.routes';
import { siteName } from './app.title';
import { SiteContentService } from '../data/services/site-content.service';
import { MediaService } from '../data/services/media.service';
import { Media } from '../shared/media/media';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Media],
  selector: 'app-root',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()',
  },
})
export class App {
  readonly document = inject(DOCUMENT);
  readonly siteContentService = inject(SiteContentService);
  readonly mediaService = inject(MediaService);

  readonly navigationRoutes: Routes = navigationRoutes;
  readonly legalRoutes: Routes = legalRoutes;
  readonly title: string = siteName;

  readonly currentYear = new Date().getFullYear();
  readonly socialMedias: { slug: string; url: string }[] = [
    {
      slug: 'instagram',
      url: 'https://www.instagram.com/zonasulbjj',
    },
    {
      slug: 'helloasso',
      url: 'https://www.helloasso.com/associations/zona-sul-academy',
    },
  ];

  onWindowScroll(): void {
    const footer: Element | null = this.document.querySelector('.footer');
    const bottomNav: Element | null = this.document.querySelector('.btm-nav');

    if (footer && bottomNav) {
      const footerRect: DOMRect = footer.getBoundingClientRect();
      const bottomNavRect: DOMRect = bottomNav.getBoundingClientRect();

      if (bottomNavRect.bottom >= footerRect.top) {
        bottomNav.classList.add('footer-transition');
      } else {
        bottomNav.classList.remove('footer-transition');
      }
    }
  }
}
