import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SITE_NAME } from './app.title';
import { legalLinks, navigationLinks } from './app.routes';
import { Media } from '../shared/media/media';

interface SocialLink {
  readonly slug: string;
  readonly label: string;
  readonly url: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Media],
  templateUrl: './app.html',
})
export class App {
  readonly title = SITE_NAME;
  readonly currentYear = new Date().getFullYear();

  readonly navigationLinks = navigationLinks;
  readonly legalLinks = legalLinks;

  /**
   * The desktop header renders the navigation on either side of the logo. An odd
   * number of entries leaves the extra one on the right, which is where the eye
   * expects the overflow.
   */
  private static readonly leadingCount = Math.floor(navigationLinks.length / 2);

  readonly leadingLinks = navigationLinks.slice(0, App.leadingCount);
  readonly trailingLinks = navigationLinks.slice(App.leadingCount);

  readonly socialLinks: readonly SocialLink[] = [
    {
      slug: 'instagram',
      label: 'Instagram',
      url: 'https://www.instagram.com/zonasulbjj',
    },
    {
      slug: 'helloasso',
      label: 'HelloAsso',
      url: 'https://www.helloasso.com/associations/zona-sul-academy',
    },
  ];
}
