import {Routes} from '@angular/router'

import {PresentationComponent} from '@page/presentation/presentation.component'
import {PlanningComponent} from '@page/planning/planning.component'
import {PricesComponent} from '@page/prices/prices.component'
import {PrivacyPolicyComponent} from '@page/privacy-policy/privacy-policy.component'
import {newsGuard} from '@app/core/guards/news.guard'
import {SingleComponent} from '@page/news/single/single.component'
import {IndexComponent} from '@page/news/index/index.component'
import {NotFoundComponent} from '@page/not-found/not-found.component'

export const navigationRoutes: Routes = [
  {
    title: 'Présentation',
    path: '',
    component: PresentationComponent /*,
    data: {
      icon: `<path fill-rule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clip-rule="evenodd" />`
    }*/
  },
  {
    title: 'Actualités',
    path: 'actualites',
    component: IndexComponent,
    canActivate: [newsGuard] /*,
    data: {
      icon: `<path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v11.75A2.75 2.75 0 0 0 16.75 18h-12A2.75 2.75 0 0 1 2 15.25V3.5Zm3.75 7a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM5 5.75A.75.75 0 0 1 5.75 5h4.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 8.25v-2.5Z" clip-rule="evenodd" /><path d="M16.5 6.5h-1v8.75a1.25 1.25 0 1 0 2.5 0V8a1.5 1.5 0 0 0-1.5-1.5Z" />`
    }*/
  },
  {
    title: 'Planning',
    path: 'planning',
    component: PlanningComponent /*,
    data: {
      icon: `<path fill-rule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clip-rule="evenodd" />`
    }*/
  },
  {
    title: 'Tarifs',
    path: 'tarifs',
    component: PricesComponent /*,
    data: {
      icon: `<path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.798 7.45c.512-.67 1.135-.95 1.702-.95s1.19.28 1.702.95a.75.75 0 0 0 1.192-.91C12.637 5.55 11.596 5 10.5 5s-2.137.55-2.894 1.54A5.205 5.205 0 0 0 6.83 8H5.75a.75.75 0 0 0 0 1.5h.77a6.333 6.333 0 0 0 0 1h-.77a.75.75 0 0 0 0 1.5h1.08c.183.528.442 1.023.776 1.46.757.99 1.798 1.54 2.894 1.54s2.137-.55 2.894-1.54a.75.75 0 0 0-1.192-.91c-.512.67-1.135.95-1.702.95s-1.19-.28-1.702-.95a3.505 3.505 0 0 1-.343-.55h1.795a.75.75 0 0 0 0-1.5H8.026a4.835 4.835 0 0 1 0-1h2.224a.75.75 0 0 0 0-1.5H8.455c.098-.195.212-.38.343-.55Z" clip-rule="evenodd" />`
    }*/
  }
]

export const legalRoutes: Routes = [
  {
    title: 'Politique de confidentialité',
    path: 'confidentialite',
    component: PrivacyPolicyComponent
  }
]

export const pageRoutes: Routes = [
  {
    path: 'actualites/:slug',
    component: SingleComponent
  },
  {
    title: 'Page introuvable',
    path: '**',
    component: NotFoundComponent
  }
]

export const routes: Routes = [
  ...navigationRoutes,
  ...legalRoutes,
  ...pageRoutes
]
