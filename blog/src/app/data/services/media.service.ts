import {inject, Injectable} from '@angular/core'
import {Apollo, gql} from 'apollo-angular'
import {ApolloQueryResult} from '@apollo/client'
import {Observable, tap} from 'rxjs'

import {Media, MediaRepository} from '@repository/media.repository'

type response = {allMedia: Media[]}

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apollo: Apollo = inject(Apollo)
  private repository: MediaRepository = inject(MediaRepository)

  public getAll(): Observable<ApolloQueryResult<response>> {
    return this.apollo
      .watchQuery<response>({
        query: gql`
          query getAllMedia {
            allMedia {
              _id
              title
              slug
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
          }
        `
      })
      .valueChanges.pipe(
        tap(({data}): void => {
          this.repository.set(data.allMedia)
        })
      )
  }
}
