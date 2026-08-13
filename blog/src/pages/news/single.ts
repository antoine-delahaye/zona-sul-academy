import { Component, computed, inject, input } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BlockTextPipe } from '../../shared/pipes/block-text';
import { ImageAltPipe } from '../../shared/pipes/image-alt';
import { PostService } from '../../data/services/post.service';

@Component({
  selector: 'app-news-single',
  imports: [RouterLink, NgOptimizedImage, DatePipe, BlockTextPipe, ImageAltPipe],
  templateUrl: './single.html',
  host: {
    class: 'grid gap-8 px-4 py-8 lg:grid-cols-12 lg:p-16',
  },
})
export class Single {
  private readonly postService = inject(PostService);

  /** Bound from the `:slug` route parameter by `withComponentInputBinding()`. */
  readonly slug = input.required<string>();

  private readonly postResource = this.postService.bySlug(this.slug);

  readonly post = this.postResource.value;
  readonly isLoading = this.postResource.isLoading;
  readonly hasFailed = computed(() => this.postResource.status() === 'error');

  /**
   * A resolved-but-empty result means the slug does not exist. The not-found
   * state is rendered in place rather than redirected to, so the URL the visitor
   * shared stays intact.
   */
  readonly notFound = computed(() => this.postResource.status() === 'resolved' && !this.post());
}
