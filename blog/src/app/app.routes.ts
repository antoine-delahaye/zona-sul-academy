import { Routes } from '@angular/router';

export const navigationRoutes: Routes = [
  {
    title: 'Le club',
    path: '',
    loadComponent: () => import('../pages/presentation/presentation').then((m) => m.Presentation),
  },
  {
    title: 'Actualités',
    path: 'actualites',
    loadComponent: () => import('../pages/news/index').then((m) => m.Index),
  },
  {
    title: 'Planning',
    path: 'planning',
    loadComponent: () => import('../pages/planning/planning').then((m) => m.Planning),
  },
  {
    title: 'Tarifs',
    path: 'tarifs',
    loadComponent: () => import('../pages/prices/prices').then((m) => m.Prices),
  },
];

export const legalRoutes: Routes = [
  {
    title: 'Politique de confidentialité',
    path: 'confidentialite',
    loadComponent: () =>
      import('../pages/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicy),
  },
];

export const pageRoutes: Routes = [
  {
    path: 'actualites/:slug',
    loadComponent: () => import('../pages/news/single').then((m) => m.Single),
  },
  {
    title: 'Page introuvable',
    path: '**',
    loadComponent: () => import('../pages/not-found/not-found').then((m) => m.NotFound),
  },
];

export const routes: Routes = [...navigationRoutes, ...legalRoutes, ...pageRoutes];
