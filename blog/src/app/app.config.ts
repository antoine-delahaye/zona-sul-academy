import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID
} from '@angular/core'
import {provideRouter, TitleStrategy} from '@angular/router'
import {provideAnimations} from '@angular/platform-browser/animations'
import {provideClientHydration} from '@angular/platform-browser'
import {provideHttpClient, withFetch} from '@angular/common/http'
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  registerLocaleData
} from '@angular/common'
import localeFr from '@angular/common/locales/fr'

import {routes} from '@app/app.routes'
import {graphqlProvider} from '@core/providers/graphql.provider'
import {TitleProvider} from '@core/providers/title.provider'

registerLocaleData(localeFr)

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    graphqlProvider,
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'EUR'
    },
    {
      provide: TitleStrategy,
      useClass: TitleProvider
    },
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig): string => {
        return `https://cdn.sanity.io/${config.src}?w=${config.width || 1000}`
      }
    }
  ]
}
