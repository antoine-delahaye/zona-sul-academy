import {inject, Injectable} from '@angular/core'
import {Apollo, QueryRef, gql} from 'apollo-angular'

export type FeaturedContent = {
  title: string
  slug: {current: string}
  excerpt: string
  mainImage: {asset: {url: string}}
  featuredButtons: {
    text: string
    url: string
    openInNewTab: boolean
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class FeaturedContentService {
  private apollo: Apollo = inject(Apollo)

  public get(): QueryRef<{allPost: FeaturedContent[]}> {
    return this.apollo.watchQuery<{allPost: FeaturedContent[]}>({
      query: gql`
        query getFeaturedContent {
          allPost(where: {featured: {eq: true}}, limit: 1) {
            title
            slug {
              current
            }
            excerpt
            mainImage {
              asset {
                url
              }
            }
            featuredButtons {
              text
              url
              openInNewTab
            }
          }
        }
      `
    })
  }
}
