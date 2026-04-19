import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { YouTubePlayer } from '@angular/youtube-player';

import { PostService } from '../../data/services/post.service';
import { SiteContentService } from '../../data/services/site-content.service';
import { Media } from '../../shared/media/media';
import { Skeleton } from '../../shared/skeleton/skeleton';

@Component({
  selector: 'app-presentation',
  imports: [RouterLink, NgOptimizedImage, YouTubePlayer, Media, Skeleton],
  templateUrl: './presentation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Presentation {
  private readonly postService = inject(PostService);
  private readonly siteContentService = inject(SiteContentService);

  private readonly featuredPostsResource = this.postService.getFeaturedPosts();
  private readonly allSiteContentResource = this.siteContentService.getAll();

  readonly featuredPost = computed(() => this.featuredPostsResource.value()?.[0]);

  readonly presentationContent = computed(() =>
    this.allSiteContentResource.value()?.find((content) => content.slug === 'presentation'),
  );

  readonly membershipButton = computed(() =>
    this.allSiteContentResource.value()?.find((content) => content.slug === 'bouton-adhesion'),
  );

  constructor() {
    effect(() => {
      console.log('Site content', this.allSiteContentResource.value());
    });
  }
}
