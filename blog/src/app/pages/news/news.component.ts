import {Component, inject, OnInit} from '@angular/core'
import {ActivatedRoute, RouterLink} from '@angular/router'
import {DatePipe, NgClass, NgOptimizedImage} from '@angular/common'

import {Post, PostService} from '@data/post.service'

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NgOptimizedImage, DatePipe, RouterLink, NgClass],
  templateUrl: 'news.component.html',
  styleUrl: 'news.component.css'
})
export class NewsComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute)
  private postService: PostService = inject(PostService)

  protected currentPage: number = 1
  protected posts: Post[] = []

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params): void => {
      this.currentPage = params['page'] ? parseInt(params['page']) : 1
      this.currentPage = this.currentPage < 1 ? 1 : this.currentPage

      this.postService
        .getCollection(3, (this.currentPage - 1) * 3)
        .valueChanges.subscribe(({data, loading}): void => {
          if (!loading) {
            this.posts = data.allPost
          }
        })
    })
  }
}
