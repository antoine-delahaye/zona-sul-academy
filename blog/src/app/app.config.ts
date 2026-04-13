import { IMAGE_LOADER, ImageLoaderConfig, registerLocaleData } from '@angular/common';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import localeFr from '@angular/common/locales/fr';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppTitle } from './app.title';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideRouter(routes),
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR',
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'EUR',
    },
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig): string => {
        return `https://cdn.sanity.io/${config.src}?w=${config.width || 1000}`;
      },
    },
    {
      provide: TitleStrategy,
      useClass: AppTitle,
    },
  ],
};
