import {Component, inject, OnInit} from '@angular/core'
import {RouterLink, RouterOutlet} from '@angular/router'

import {PostService} from '@service/post.service'
import {FeaturedPost, PostRepository} from '@repository/post.repository'
import {
  ImageSection,
  SiteContent,
  SiteContentRepository,
  VideoSection
} from '@repository/site-content.repository'
import {MediaComponent} from '@shared/media/media.component'
import {SkeletonComponent} from '@shared/skeleton/skeleton.component'
import {NgClass, NgOptimizedImage} from '@angular/common'

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [
    RouterLink,
    MediaComponent,
    SkeletonComponent,
    RouterOutlet,
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: 'presentation.component.html'
})
export class PresentationComponent implements OnInit {
  private postService: PostService = inject(PostService)
  private postRepository: PostRepository = inject(PostRepository)
  private siteContentRepository: SiteContentRepository = inject(
    SiteContentRepository
  )

  protected featuredPost?: FeaturedPost
  protected presentationSections: (ImageSection | VideoSection)[] = []
  protected membershipButton?: SiteContent

  public ngOnInit(): void {
    this.postService.getFeaturedPosts().subscribe({
      next: ({loading}): void => {
        if (!loading) {
          this.featuredPost = this.postRepository.getFeaturedPosts()[0]
        }
      }
    })

    this.siteContentRepository
      .siteContent$('presentation')
      .subscribe((presentationContent: SiteContent | undefined): void => {
        this.presentationSections = presentationContent?.pageBuilder as (
          | ImageSection
          | VideoSection
        )[]
      })

    this.siteContentRepository
      .siteContent$('bouton-adhesion')
      .subscribe((membershipButton: SiteContent | undefined): void => {
        this.membershipButton = membershipButton
      })
  }
}
