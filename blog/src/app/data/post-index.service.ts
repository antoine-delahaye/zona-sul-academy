import {inject, Injectable} from '@angular/core'
import {Apollo, QueryRef, gql} from 'apollo-angular'

export type PostPreview = {
  title: string
  _createdAt: string
  slug: {current: string}
  excerpt: string
  mainImage: {
    asset: {
      altText: string
      path: string
      metadata: {dimensions: {width: number; height: number}}
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class PostIndexService {
  private apollo: Apollo = inject(Apollo)

  public get(
    limit: number = 3,
    offset: number = 0
  ): QueryRef<{allPost: PostPreview[]}> {
    return this.apollo.watchQuery<{allPost: PostPreview[]}>({
      query: gql`
        query getPosts {
          allPost(limit: ${limit}, offset: ${offset}, sort: [{_createdAt: DESC}]) {
            title
            _createdAt
            slug {
              current
            }
            excerpt
            mainImage {
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
  }
}
