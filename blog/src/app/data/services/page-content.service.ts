import {inject, Injectable} from '@angular/core'
import {Apollo, gql} from 'apollo-angular'
import {ApolloQueryResult} from '@apollo/client'
import {Observable, tap} from 'rxjs'

import {
  PageContent,
  PageContentRepository
} from '@repository/page-content.repository'

type response = {allPageContent: PageContent[]}

@Injectable({
  providedIn: 'root'
})
export class PageContentService {
  private apollo: Apollo = inject(Apollo)
  private repository: PageContentRepository = inject(PageContentRepository)

  public get(): Observable<ApolloQueryResult<response>> {
    return this.apollo
      .watchQuery<response>({
        query: gql`
          query getAllPageContent {
            allPageContent {
              _id
              title
              slug
              bodyRaw
            }
          }
        `
      })
      .valueChanges.pipe(
        tap(({data}): void => {
          this.repository.set(data.allPageContent)
        })
      )
  }
}
