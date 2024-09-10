import {
  ApplicationConfig,
  inject,
  InjectionToken
  // makeStateKey,
  // StateKey,
  // TransferState
} from '@angular/core'
import {Apollo, APOLLO_OPTIONS} from 'apollo-angular'
import {HttpLink, HttpLinkHandler} from 'apollo-angular/http'
import {InMemoryCache} from '@apollo/client/core'

import {environment} from '@environment/environment'

const uri: string = `https://${environment.sanity.projectId}.api.sanity.io/v${environment.sanity.apiVersion}/graphql/${environment.sanity.dataset}/default`
const APOLLO_CACHE: InjectionToken<InMemoryCache> =
  new InjectionToken<InMemoryCache>('apollo-cache')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const STATE_KEY: StateKey<never> = makeStateKey<any>('apollo.state')

function apolloOptionsFactory(): {
  link: HttpLinkHandler
  cache: InMemoryCache
} {
  const httpLink: HttpLink = inject(HttpLink)
  // const transferState: TransferState = inject(TransferState)
  const cache: InMemoryCache = inject(APOLLO_CACHE)

  /*// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isBrowser: boolean = transferState.hasKey<any>(STATE_KEY)
  if (isBrowser) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = transferState.get<any>(STATE_KEY, null)
    cache.restore(state)
  } else {
    transferState.onSerialize(STATE_KEY, () => {
      return cache.extract()
    })
    cache.reset().then()
  }*/

  return {
    link: httpLink.create({uri}),
    cache
  }
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_CACHE,
    useValue: new InMemoryCache()
  },
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory
  }
]
