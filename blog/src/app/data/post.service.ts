import {inject, Injectable} from '@angular/core'
import {Apollo, QueryRef} from 'apollo-angular'
import {gql} from '@apollo/client/core'

export type Post = {
  title: string
  _createdAt: string
  slug: {current: string}
  excerpt: string
  mainImage: {
    asset: {
      path: string
      metadata: {dimensions: {width: number; height: number}}
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apollo: Apollo = inject(Apollo)

  public getCollection(
    limit: number = 3,
    offset: number = 0
  ): QueryRef<{allPost: Post[]}> {
    return this.apollo.watchQuery<{allPost: Post[]}>({
      query: gql`
        query {
          allPost(limit: ${limit}, offset: ${offset}, sort: [{_createdAt: DESC}]) {
            title
            _createdAt
            slug {
              current
            }
            excerpt
            mainImage {
              asset {
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
  }
}
