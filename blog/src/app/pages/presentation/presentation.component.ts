import {Component, inject, OnInit} from '@angular/core'
import {RouterLink} from '@angular/router'

import {
  FeaturedContent,
  FeaturedContentService
} from '@data/featured-content.service'
import {PageContentRepository} from '@repository/page-content.repository'

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: 'presentation.component.html'
})
export class PresentationComponent implements OnInit {
  private featuredContentService: FeaturedContentService = inject(
    FeaturedContentService
  )
  protected pageContentRepository: PageContentRepository = inject(
    PageContentRepository
  )

  protected featuredContent: FeaturedContent | undefined

  public ngOnInit(): void {
    this.featuredContentService
      .get()
      .valueChanges.subscribe(({data, loading}): void => {
        if (!loading) {
          if (data.allPost.length) {
            this.featuredContent = data.allPost[0]
          }
        }
      })
  }
}
