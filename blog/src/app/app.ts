import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
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
  private readonly destroyRef = inject(DestroyRef);

  private readonly siteFooter = viewChild.required<ElementRef<HTMLElement>>('siteFooter');

  /**
   * Whether the main footer is on screen. The fixed mobile dock fades out while
   * it is, so the two never overlap.
   */
  readonly siteFooterVisible = signal(false);

  readonly title = SITE_NAME;
  readonly currentYear = new Date().getFullYear();

  readonly navigationLinks = navigationLinks;
  readonly legalLinks = legalLinks;

  /** The desktop header renders the navigation on either side of the logo. */
  readonly leadingLinks = navigationLinks.slice(0, Math.ceil(navigationLinks.length / 2));
  readonly trailingLinks = navigationLinks.slice(Math.ceil(navigationLinks.length / 2));

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

  constructor() {
    // Observing the footer beats a scroll listener: the callback only fires when
    // the intersection actually changes. Browser-only, so it stays out of SSR.
    afterNextRender(() => {
      const observer = new IntersectionObserver((entries) => {
        this.siteFooterVisible.set(entries.some((entry) => entry.isIntersecting));
      });

      observer.observe(this.siteFooter().nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
