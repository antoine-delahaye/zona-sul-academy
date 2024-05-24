import {Component, inject, OnInit} from '@angular/core'
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Routes
} from '@angular/router'
import {AsyncPipe, NgOptimizedImage} from '@angular/common'
import {Meta} from '@angular/platform-browser'

import {legalRoutes, navigationRoutes} from '@app/app.routes'
import {siteName} from '@app/core/providers/title.provider'

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
  private meta: Meta = inject(Meta)
  protected route: ActivatedRoute = inject(ActivatedRoute)

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
    this.meta.addTags([
      {
        name: 'description',
        content:
          "Bienvenue sur le site de Zona Sul Academy, une association sportive loi 1901 proposant l'enseignement du jiu-jitsu brésilien et du grappling sur Orléans"
      },
      {
        name: 'keywords',
        content: 'JJB, Jiu-jitsu brésilien, Grappling, Sport, Combat, Orléans'
      }
    ])
  }
}
