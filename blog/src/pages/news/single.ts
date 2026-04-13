import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  input,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { PostService } from '../../data/services/post.service';
import { PostSingle } from '../../data/models/post.model';

@Component({
  selector: 'app-news-single',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './single.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Single {
  readonly slug = input.required<string>();

  private readonly postService = inject(PostService);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  readonly post = signal<PostSingle | undefined>(undefined);

  constructor() {
    toObservable(this.slug)
      .pipe(takeUntilDestroyed())
      .subscribe((currentSlug) => {
        if (!currentSlug) return;

        runInInjectionContext(this.injector, () => {
          const postResource = this.postService.getPostSingle(currentSlug);

          effect(() => {
            const value = postResource.value();
            const isLoading = postResource.isLoading();

            if (value) {
              if (value._createdAt) {
                this.post.set(value);
              } else {
                this.router.navigateByUrl('/404');
              }
            } else if (!isLoading && value === undefined) {
              this.router.navigateByUrl('/404');
            }
          });
        });
      });
  }
}
