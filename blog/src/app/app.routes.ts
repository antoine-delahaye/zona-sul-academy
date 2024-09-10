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
    title: 'Le club',
    path: '',
    component: PresentationComponent
  },
  {
    title: 'Actualités',
    path: 'actualites',
    component: IndexComponent,
    canActivate: [newsGuard]
  },
  {
    title: 'Planning',
    path: 'planning',
    component: PlanningComponent
  },
  {
    title: 'Tarifs',
    path: 'tarifs',
    component: PricesComponent
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
