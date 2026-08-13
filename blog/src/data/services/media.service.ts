import { Service, inject, resource } from '@angular/core';

import { Media } from '../models/media.model';
import { MEDIA_QUERY } from './groq';
import { SanityService } from './sanity.service';

@Service()
export class MediaService {
  private readonly sanity = inject(SanityService);

  /**
   * Every managed image, fetched once per application instance.
   *
   * The set is tiny (logo, social icons, planning) and shared by the layout, so
   * a single resource beats one request per consumer. `id` lets the server hand
   * the result to the browser through the transfer state instead of the client
   * re-fetching it during hydration.
   */
  readonly all = resource({
    id: 'sanity.media',
    defaultValue: [] as Media[],
    loader: ({ abortSignal }) => this.sanity.query<Media[]>(MEDIA_QUERY, {}, abortSignal),
  });
}
