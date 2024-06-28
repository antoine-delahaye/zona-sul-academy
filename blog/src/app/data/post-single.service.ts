import {inject, Injectable} from '@angular/core'
import {Apollo, QueryRef, gql} from 'apollo-angular'

export type Post = {
  title: string
  _createdAt: string
  mainImage: {
    asset: {
      altText: string
      path: string
      metadata: {dimensions: {width: number; height: number}}
    }
  }
  bodyRaw: {
    children: {
      text: string
      _type: string
      _key: string
    }[]
    _type: string
    _key: string
    style: string
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class PostSingleService {
  private apollo: Apollo = inject(Apollo)

  public get(slug: string): QueryRef<{allPost: Post[]}> {
    return this.apollo.watchQuery<{allPost: Post[]}>({
      query: gql`
        query getPost {
          allPost(where: {slug: {current: {eq: "${slug}"}}}) {
            title
            _createdAt
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
            bodyRaw
          }
        }
      `
    })
  }
}
