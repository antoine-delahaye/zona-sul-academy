import { Service, Signal, inject, resource } from '@angular/core';

import { FeaturedPost, PostPreview, PostSingle } from '../models/post.model';
import { FEATURED_POSTS_QUERY, POST_BY_SLUG_QUERY, POST_PREVIEWS_QUERY } from './groq';
import { SanityService } from './sanity.service';

@Service()
export class PostService {
  private readonly sanity = inject(SanityService);

  /**
   * One page of post previews, reloaded whenever `page` changes.
   *
   * Must be called from an injection context (a component field initialiser),
   * since the returned resource is tied to the caller's lifecycle.
   */
  previews(page: Signal<number>, pageSize: number) {
    return resource({
      id: 'sanity.post-previews',
      defaultValue: [] as PostPreview[],
      params: () => {
        const from = (Math.max(1, page()) - 1) * pageSize;
        return { from, to: from + pageSize };
      },
      loader: ({ params, abortSignal }) =>
        this.sanity.query<PostPreview[]>(POST_PREVIEWS_QUERY, params, abortSignal),
    });
  }

  /**
   * A single post, reloaded whenever `slug` changes.
   *
   * Resolves to `null` when no post matches, which callers can distinguish from
   * `undefined` (still loading) to render a not-found state.
   */
  bySlug(slug: Signal<string>) {
    return resource({
      id: 'sanity.post-by-slug',
      params: () => ({ slug: slug() }),
      loader: ({ params, abortSignal }) =>
        this.sanity.query<PostSingle | null>(POST_BY_SLUG_QUERY, params, abortSignal),
    });
  }

  /** Posts flagged `featured` in the Studio, newest first. */
  featured() {
    return resource({
      id: 'sanity.featured-posts',
      defaultValue: [] as FeaturedPost[],
      loader: ({ abortSignal }) =>
        this.sanity.query<FeaturedPost[]>(FEATURED_POSTS_QUERY, {}, abortSignal),
    });
  }
}
