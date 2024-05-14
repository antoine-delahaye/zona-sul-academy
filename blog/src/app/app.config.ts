import {ApplicationConfig} from '@angular/core'
import {provideRouter, TitleStrategy} from '@angular/router'
import {provideClientHydration} from '@angular/platform-browser'
import {provideHttpClient} from '@angular/common/http'
import {IMAGE_LOADER, ImageLoaderConfig} from '@angular/common'

import {routes} from '@app/app.routes'
import {graphqlProvider} from '@app/graphql.provider'
import {environment} from '@environment/environment'
import {TemplatePageTitleStrategy} from '@app/title.provider'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    graphqlProvider,
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy
    },
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig): string => {
        return `https://cdn.sanity.io/images/${environment.sanity.projectId}/${environment.sanity.dataset}/${config.src}?w=${config.width}`
      }
    }
  ]
}
