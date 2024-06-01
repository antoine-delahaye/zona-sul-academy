import {Component, inject, OnInit} from '@angular/core'
import {ActivatedRoute, RouterLink} from '@angular/router'
import {DatePipe, NgClass, NgOptimizedImage} from '@angular/common'

import {PostPreview, PostIndexService} from '@data/post-index.service'

@Component({
  selector: 'app-news-index',
  standalone: true,
  imports: [DatePipe, NgOptimizedImage, RouterLink, NgClass],
  templateUrl: 'index.component.html'
})
export class IndexComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute)
  private postIndexService: PostIndexService = inject(PostIndexService)

  protected currentPage: number = 1
  protected posts: PostPreview[] = []

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params): void => {
      this.currentPage = params['page'] ? parseInt(params['page']) : 1
      this.currentPage = this.currentPage < 1 ? 1 : this.currentPage

      this.postIndexService
        .get(3, (this.currentPage - 1) * 3)
        .valueChanges.subscribe(({data, loading}): void => {
          if (!loading) {
            this.posts = data.allPost
          }
        })
    })
  }
}
