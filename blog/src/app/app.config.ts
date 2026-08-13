import { IMAGE_LOADER, ImageLoaderConfig, registerLocaleData } from '@angular/common';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import localeFr from '@angular/common/locales/fr';

import { AppTitle } from './app.title';
import { routes } from './app.routes';
import { SANITY_DEFAULT_IMAGE_WIDTH, SANITY_IMAGE_CDN_URL } from '../data/sanity.config';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideRouter(
      routes,
      // Route and query parameters are bound straight to component inputs,
      // which is what `Single.slug` and `Index.page` rely on.
      withComponentInputBinding(),
      // Without this, navigating from the footer lands mid-page on the next route.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    {
      // `auto=format` lets Sanity serve AVIF/WebP based on the Accept header.
      provide: IMAGE_LOADER,
      useValue: ({ src, width }: ImageLoaderConfig): string =>
        `${SANITY_IMAGE_CDN_URL}/${src}?w=${width ?? SANITY_DEFAULT_IMAGE_WIDTH}&auto=format`,
    },
    { provide: TitleStrategy, useClass: AppTitle },
  ],
};
