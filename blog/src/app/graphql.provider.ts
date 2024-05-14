import {Apollo, APOLLO_OPTIONS} from 'apollo-angular'
import {HttpLink, HttpLinkHandler} from 'apollo-angular/http'
import {ApplicationConfig, inject} from '@angular/core'
import {InMemoryCache} from '@apollo/client/core'

import {environment} from '@environment/environment'

const uri: string = `https://${environment.sanity.projectId}.api.sanity.io/v${environment.sanity.apiVersion}/graphql/${environment.sanity.dataset}`

export function apolloOptionsFactory(): {
  link: HttpLinkHandler
  cache: InMemoryCache
} {
  const httpLink: HttpLink = inject(HttpLink)
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache()
  }
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory
  }
]
