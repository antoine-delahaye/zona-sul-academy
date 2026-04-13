import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MediaService } from '../../data/services/media.service';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-media',
  templateUrl: './media.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Media {
  readonly mediaService = inject(MediaService);

  readonly allMedia = this.mediaService.getAll();

  readonly slug = input<string>();
  readonly class = input<string>('');

  readonly media = computed(() => {
    const currentSlug = this.slug();
    const mediaList = this.allMedia.value();

    if (!currentSlug || !mediaList) {
      return undefined;
    }

    return mediaList.find((m) => m.slug === currentSlug);
  });
}
