import { Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { MediaService } from '../../data/services/media.service';
import { sanityImageAlt } from '../../data/models/sanity-image.model';

/**
 * Renders a Studio-managed image by slug (logo, social icons, planning board).
 *
 * The class list is taken as an explicit `imageClass` input rather than a `class`
 * input, which would shadow the host element's own class attribute.
 */
@Component({
  selector: 'app-media',
  imports: [NgOptimizedImage],
  templateUrl: './media.html',
})
export class Media {
  private readonly mediaService = inject(MediaService);

  readonly slug = input.required<string>();
  readonly imageClass = input<string>('');
  /** Set on the single largest above-the-fold image only. */
  readonly priority = input<boolean>(false);
  /**
   * Overrides the alternative text resolved from Sanity. Pass `''` for an image
   * that is purely decorative, so screen readers skip it.
   */
  readonly altText = input<string>();

  private readonly media = computed(() =>
    this.mediaService.all.value().find((item) => item.slug === this.slug()),
  );

  readonly image = computed(() => this.media()?.image);

  /** Falls back to the media title, so the image is never left without a label. */
  readonly alt = computed(
    () => this.altText() ?? sanityImageAlt(this.image(), this.media()?.title ?? ''),
  );
}
