import {Routes} from '@angular/router'

import {NewsComponent} from '@page/news/news.component'
import {PresentationComponent} from '@page/presentation/presentation.component'
import {PlanningComponent} from '@page/planning/planning.component'
import {PricesComponent} from '@page/prices/prices.component'
import {PrivacyPolicyComponent} from '@page/privacy-policy/privacy-policy.component'
import {newsGuard} from '@app/core/guards/news.guard'

export const navigationRoutes: Routes = [
  {
    title: 'Présentation',
    path: '',
    component: PresentationComponent
  },
  {
    title: 'Actualités',
    path: 'actualites',
    component: NewsComponent,
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

export const routes: Routes = [...navigationRoutes, ...legalRoutes]
