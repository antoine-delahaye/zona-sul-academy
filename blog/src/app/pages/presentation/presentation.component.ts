import {Component, inject, OnInit} from '@angular/core'
import {RouterLink, RouterOutlet} from '@angular/router'

import {PostService} from '@service/post.service'
import {FeaturedPost, PostRepository} from '@repository/post.repository'
import {
  PageContent,
  PageContentRepository
} from '@src/app/data/repositories/page-content.repository'
import {MediaComponent} from '@shared/media/media.component'
import {SkeletonComponent} from '@shared/skeleton/skeleton.component'

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [RouterLink, MediaComponent, SkeletonComponent, RouterOutlet],
  templateUrl: 'presentation.component.html'
})
export class PresentationComponent implements OnInit {
  private postService: PostService = inject(PostService)
  protected postRepository: PostRepository = inject(PostRepository)
  protected pageContentRepository: PageContentRepository = inject(
    PageContentRepository
  )

  protected featuredPost?: FeaturedPost
  protected membershipLink?: PageContent

  public ngOnInit(): void {
    this.postService.getFeaturedPosts().subscribe({
      next: ({loading}): void => {
        if (!loading) {
          this.featuredPost = this.postRepository.getFeaturedPosts()[0]
        }
      }
    })

    this.pageContentRepository
      .pageContent$('adhesion-helloasso')
      .subscribe((membershipLink: PageContent | undefined): void => {
        this.membershipLink = membershipLink
      })
  }
}
