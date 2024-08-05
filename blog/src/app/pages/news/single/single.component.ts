import {Component, inject, OnInit} from '@angular/core'
import {ActivatedRoute, Params, Router} from '@angular/router'
import {DatePipe, NgOptimizedImage} from '@angular/common'

import {PostService} from '@src/app/data/services/post.service'
import {
  PostRepository,
  PostSingle
} from '@src/app/data/repositories/post.repository'

@Component({
  selector: 'app-news-single',
  standalone: true,
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: 'single.component.html'
})
export class SingleComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute)
  private router: Router = inject(Router)
  private postService: PostService = inject(PostService)
  private postRepository: PostRepository = inject(PostRepository)

  protected post?: PostSingle

  public ngOnInit(): void {
    this.route.params.subscribe((params: Params): void => {
      this.postService.getPostSingle(params['slug']).subscribe({
        next: ({loading}): void => {
          if (!loading) {
            this.postRepository.postSingleStore
              .subscribe((post: PostSingle): void => {
                if (post._createdAt) {
                  this.post = post
                } else {
                  this.router.navigateByUrl('/404').then()
                }
              })
              .unsubscribe()
          }
        }
      })
    })
  }
}
