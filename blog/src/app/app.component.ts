import {Component, inject, OnInit} from '@angular/core'
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Routes
} from '@angular/router'
import {AsyncPipe, NgOptimizedImage} from '@angular/common'

import {navigationRoutes, legalRoutes} from '@app/app.routes'
import {siteName} from '@app/core/providers/title.provider'
import {PageContentService} from '@service/page-content.service'
import {MediaService} from '@service/media.service'
import {MediaComponent} from '@shared/media/media.component'
import {
  PageContent,
  PageContentRepository
} from '@repository/page-content.repository'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.css',
  imports: [
    RouterOutlet,
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    MediaComponent
  ],
  standalone: true
})
export class AppComponent implements OnInit {
  private pageContentService: PageContentService = inject(PageContentService)
  private mediaService: MediaService = inject(MediaService)
  protected route: ActivatedRoute = inject(ActivatedRoute)
  protected pageContentRepository: PageContentRepository = inject(
    PageContentRepository
  )

  protected navigationRoutes: Routes = navigationRoutes
  protected legalRoutes: Routes = legalRoutes
  protected title: string = siteName
  protected currentDate: Date = new Date()
  protected socialMedias: {title: string; url: string}[] = [
    {
      title: 'Instagram',
      url: 'https://www.instagram.com/zonasulbjj'
    },
    {
      title: 'HelloAsso',
      url: 'https://www.helloasso.com/associations/zona-sul-academy'
    }
  ]
  protected membershipLink?: PageContent

  public ngOnInit(): void {
    this.pageContentService.getAll().subscribe({
      next: (): void => {
        this.membershipLink =
          this.pageContentRepository.get('adhesion-helloasso')
      }
    })
    this.mediaService.getAll().subscribe()
  }
}
