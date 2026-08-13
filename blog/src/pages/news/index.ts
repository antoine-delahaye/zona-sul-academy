import { Component, computed, inject, input } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ImageAltPipe } from '../../shared/pipes/image-alt';
import { PostService } from '../../data/services/post.service';

const POSTS_PER_PAGE = 3;

/** Coerces the `?page=` query parameter into a usable page number. */
function toPageNumber(value: string | number | undefined): number {
  const parsed = typeof value === 'number' ? value : Number.parseInt(value ?? '', 10);

  return Number.isFinite(parsed) && parsed >= 1 ? Math.trunc(parsed) : 1;
}

@Component({
  selector: 'app-news-index',
  imports: [RouterLink, NgOptimizedImage, DatePipe, ImageAltPipe],
  templateUrl: './index.html',
  host: {
    class: 'grid gap-8 px-4 py-8 lg:grid-cols-12 lg:p-16',
  },
})
export class Index {
  private readonly postService = inject(PostService);

  /** Bound from `?page=` by `withComponentInputBinding()`. */
  readonly page = input(1, { transform: toPageNumber });

  private readonly postsResource = this.postService.previews(this.page, POSTS_PER_PAGE);

  readonly posts = this.postsResource.value;
  readonly isLoading = this.postsResource.isLoading;
  readonly hasFailed = computed(() => this.postsResource.status() === 'error');

  readonly previousPage = computed(() => this.page() - 1);
  readonly nextPage = computed(() => this.page() + 1);
  readonly hasPreviousPage = computed(() => this.page() > 1);
  /** A full page suggests there is more; a short page means this is the last one. */
  readonly hasNextPage = computed(() => this.posts().length === POSTS_PER_PAGE);
}
