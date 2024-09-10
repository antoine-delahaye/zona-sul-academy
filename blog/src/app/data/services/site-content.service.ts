import {inject, Injectable} from '@angular/core'
import {Apollo, gql} from 'apollo-angular'
import {ApolloQueryResult} from '@apollo/client'
import {Observable, tap} from 'rxjs'

import {
  SiteContent,
  SiteContentRepository
} from '@repository/site-content.repository'

type response = {allSiteContent: SiteContent[]}

@Injectable({
  providedIn: 'root'
})
export class SiteContentService {
  private apollo: Apollo = inject(Apollo)
  private repository: SiteContentRepository = inject(SiteContentRepository)

  public getAll(): Observable<ApolloQueryResult<response>> {
    return this.apollo
      .watchQuery<response>({
        query: gql`
          query getAllSiteContent {
            allSiteContent {
              _id
              title
              slug
              subtitleRaw
              pageBuilder {
                ... on ImageSection {
                  __typename
                  _key
                  title
                  bodyRaw
                  image {
                    asset {
                      altText
                      path
                      metadata {
                        dimensions {
                          width
                          height
                        }
                      }
                    }
                  }
                }
                ... on VideoSection {
                  __typename
                  _key
                  title
                  bodyRaw
                  videoId
                }
                ... on MembershipSection {
                  __typename
                  _key
                  title
                  descriptionRaw
                  requirements
                  price
                  priceInfo
                  additionalInfo
                  buttonUrl
                  buttonText
                }
              }
            }
          }
        `
      })
      .valueChanges.pipe(
        tap(({data}): void => {
          this.repository.set(data.allSiteContent)
        })
      )
  }
}
