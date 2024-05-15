import {ApplicationConfig} from '@angular/core'
import {provideRouter, TitleStrategy} from '@angular/router'
import {provideAnimations} from '@angular/platform-browser/animations'
import {provideClientHydration} from '@angular/platform-browser'
import {provideHttpClient, withFetch} from '@angular/common/http'
import {IMAGE_LOADER, ImageLoaderConfig} from '@angular/common'

import {routes} from '@app/app.routes'
import {graphqlProvider} from '@app/graphql.provider'
import {TemplatePageTitleStrategy} from '@app/title.provider'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    graphqlProvider,
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy
    },
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig): string => {
        return `https://cdn.sanity.io/${config.src}?w=${config.width}`
      }
    }
  ]
}
