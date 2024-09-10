import {bootstrapApplication} from '@angular/platform-browser'
import {ApplicationRef} from '@angular/core'
import {devTools} from '@ngneat/elf-devtools'
import {enableElfProdMode} from '@ngneat/elf'

import {appConfig} from '@app/app.config'
import {AppComponent} from '@app/app.component'
import {environment} from '@environment/environment'

if (environment.production) {
  enableElfProdMode()
}

bootstrapApplication(AppComponent, appConfig)
  .then((ref: ApplicationRef): void => {
    devTools({
      postTimelineUpdate: () => ref.injector.get(ApplicationRef).tick()
    })
  })
  .catch((err) => console.error(err))
