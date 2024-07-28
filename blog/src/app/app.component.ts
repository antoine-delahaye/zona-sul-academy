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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.css',
  imports: [
    RouterOutlet,
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    AsyncPipe
  ],
  standalone: true
})
export class AppComponent implements OnInit {
  protected route: ActivatedRoute = inject(ActivatedRoute)
  protected pageContentService: PageContentService = inject(PageContentService)

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

  public ngOnInit(): void {
    this.pageContentService.get().subscribe()
  }
}
