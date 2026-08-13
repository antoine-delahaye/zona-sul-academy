import { Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { YouTubePlayer } from '@angular/youtube-player';

import { BlockTextPipe } from '../../shared/pipes/block-text';
import { ImageAltPipe } from '../../shared/pipes/image-alt';
import { Media } from '../../shared/media/media';
import { PostService } from '../../data/services/post.service';
import { SiteContentService } from '../../data/services/site-content.service';
import { Skeleton } from '../../shared/skeleton/skeleton';
import { portableTextBlockToPlainText } from '../../data/models/portable-text.model';

@Component({
  selector: 'app-presentation',
  imports: [
    RouterLink,
    NgOptimizedImage,
    YouTubePlayer,
    Media,
    Skeleton,
    BlockTextPipe,
    ImageAltPipe,
  ],
  templateUrl: './presentation.html',
})
export class Presentation {
  private readonly postService = inject(PostService);
  private readonly siteContentService = inject(SiteContentService);

  private readonly featuredPosts = this.postService.featured();
  private readonly membershipButton = this.siteContentService.bySlug('bouton-adhesion');

  readonly featuredPost = computed(() => this.featuredPosts.value().at(0));
  readonly content = this.siteContentService.bySlug('presentation');

  /**
   * The membership URL is authored as the subtitle of a dedicated `siteContent`
   * entry, so it arrives as Portable Text rather than a plain string field.
   */
  readonly membershipUrl = computed(
    () => portableTextBlockToPlainText(this.membershipButton()?.subtitle?.at(0)).trim() || null,
  );
}
