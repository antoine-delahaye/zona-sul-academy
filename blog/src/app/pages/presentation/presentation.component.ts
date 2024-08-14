import {Component, inject, OnInit} from '@angular/core'
import {RouterLink, RouterOutlet} from '@angular/router'
import {NgClass, NgOptimizedImage} from '@angular/common'

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
import {YouTubePlayer} from '@angular/youtube-player'

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [
    RouterLink,
    MediaComponent,
    SkeletonComponent,
    RouterOutlet,
    NgClass,
    NgOptimizedImage,
    YouTubePlayer
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
  protected presentationContent?: SiteContent & {
    pageBuilder: (ImageSection | VideoSection)[]
  }
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
        this.presentationContent = presentationContent as SiteContent & {
          pageBuilder: (ImageSection | VideoSection)[]
        }
      })

    this.siteContentRepository
      .siteContent$('bouton-adhesion')
      .subscribe((membershipButton: SiteContent | undefined): void => {
        this.membershipButton = membershipButton
      })
  }
}
