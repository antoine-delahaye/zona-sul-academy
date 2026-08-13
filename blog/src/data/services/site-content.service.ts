import { Service, computed, inject, resource } from '@angular/core';

import { SiteContent } from '../models/site-content.model';
import { SITE_CONTENT_QUERY } from './groq';
import { SanityService } from './sanity.service';

@Service()
export class SiteContentService {
  private readonly sanity = inject(SanityService);

  /** Every Studio-managed page, fetched once and shared across routes. */
  readonly all = resource({
    id: 'sanity.site-content',
    defaultValue: [] as SiteContent[],
    loader: ({ abortSignal }) =>
      this.sanity.query<SiteContent[]>(SITE_CONTENT_QUERY, {}, abortSignal),
  });

  /** Narrows the shared collection down to one page, by slug. */
  bySlug(slug: string) {
    return computed(() => this.all.value().find((content) => content.slug === slug));
  }
}
