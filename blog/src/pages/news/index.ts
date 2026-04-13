import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PostService } from '../../data/services/post.service';
import { PostPreview } from '../../data/models/post.model';

@Component({
  selector: 'app-news-index',
  imports: [RouterLink, NgOptimizedImage, DatePipe],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Index {
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly injector = inject(Injector);

  readonly currentPage = signal<number>(1);
  readonly posts = signal<PostPreview[] | undefined>(undefined);

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      const pageParam = params['page'];
      const page = pageParam ? parseInt(pageParam as string, 10) : 1;
      const validPage = page < 1 ? 1 : page;

      this.currentPage.set(validPage);

      const offset = (validPage - 1) * 3;

      runInInjectionContext(this.injector, () => {
        const res = this.postService.getPostPreviews(3, offset);

        effect(() => {
          const value = res.value();
          if (value !== undefined) {
            this.posts.set(value);
          }
        });
      });
    });
  }
}
