import {Component, HostListener, inject, OnInit} from '@angular/core'
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Routes
} from '@angular/router'
import {AsyncPipe, NgOptimizedImage} from '@angular/common'

import {navigationRoutes, legalRoutes} from '@app/app.routes'
import {siteName} from '@app/core/providers/title.provider'
import {SiteContentService} from '@service/site-content.service'
import {MediaService} from '@service/media.service'
import {MediaComponent} from '@shared/media/media.component'

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
  private siteContentService: SiteContentService = inject(SiteContentService)
  private mediaService: MediaService = inject(MediaService)

  protected navigationRoutes: Routes = navigationRoutes
  protected legalRoutes: Routes = legalRoutes
  protected title: string = siteName
  protected currentDate: Date = new Date()
  protected socialMedias: {slug: string; url: string}[] = [
    {
      slug: 'instagram',
      url: 'https://www.instagram.com/zonasulbjj'
    },
    {
      slug: 'helloasso',
      url: 'https://www.helloasso.com/associations/zona-sul-academy'
    }
  ]

  public ngOnInit(): void {
    this.siteContentService.getAll().subscribe()
    this.mediaService.getAll().subscribe()
  }

  @HostListener('window:scroll', [])
  protected onWindowScroll(): void {
    const footer: Element | null = document.querySelector('.footer')
    const bottomNav: Element | null = document.querySelector('.btm-nav')
    if (footer && bottomNav) {
      const footerRect: DOMRect = footer.getBoundingClientRect()
      const bottomNavRect: DOMRect = bottomNav.getBoundingClientRect()
      if (bottomNavRect.bottom >= footerRect.top) {
        bottomNav.classList.add('footer-transition')
      } else {
        bottomNav.classList.remove('footer-transition')
      }
    }
  }
}
