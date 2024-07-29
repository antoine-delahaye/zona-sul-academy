import {Component, inject, OnInit} from '@angular/core'
import {ActivatedRoute, RouterLink} from '@angular/router'
import {AsyncPipe, DatePipe, NgClass, NgOptimizedImage} from '@angular/common'

import {PostService} from '@service/post.service'
import {PostRepository} from '@src/app/data/repositories/post.repository'

@Component({
  selector: 'app-news-index',
  standalone: true,
  imports: [DatePipe, NgOptimizedImage, RouterLink, NgClass, AsyncPipe],
  templateUrl: 'index.component.html'
})
export class IndexComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute)
  private postService: PostService = inject(PostService)
  protected postRepository: PostRepository = inject(PostRepository)

  protected currentPage: number = 1

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params): void => {
      this.currentPage = params['page'] ? parseInt(params['page']) : 1
      this.currentPage = this.currentPage < 1 ? 1 : this.currentPage

      this.postService
        .getPostPreviews(3, (this.currentPage - 1) * 3)
        .subscribe()
    })
  }
}
