import {Component, inject, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {DatePipe, NgOptimizedImage} from '@angular/common'

import {Post, PostSingleService} from '@data/post-single.service'

@Component({
  selector: 'app-news-single',
  standalone: true,
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: 'single.component.html'
})
export class SingleComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute)
  private router: Router = inject(Router)
  private postSingleService: PostSingleService = inject(PostSingleService)

  protected post?: Post

  public ngOnInit(): void {
    const slug: string | null = this.route.snapshot.paramMap.get('slug')
    if (slug) {
      this.postSingleService
        .get(slug)
        .valueChanges.subscribe(({data, loading}): void => {
          if (!loading) {
            if (data.allPost.length == 1) {
              this.post = data.allPost[0]
            } else {
              this.router.navigateByUrl('/404').then()
            }
          }
        })
    }
  }
}
