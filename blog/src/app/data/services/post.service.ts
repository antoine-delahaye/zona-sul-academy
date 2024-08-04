import {inject, Injectable} from '@angular/core'
import {Apollo, gql} from 'apollo-angular'
import {ApolloQueryResult} from '@apollo/client'
import {Observable, tap} from 'rxjs'

import {
  PostPreview,
  PostSingle,
  PostRepository,
  FeaturedPost
} from '@repository/post.repository'

type PostPreviewResponse = {allPost: PostPreview[]}
type PostSingleResponse = {allPost: PostSingle[]}
type FeaturedPostResponse = {allPost: FeaturedPost[]}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apollo: Apollo = inject(Apollo)
  private repository: PostRepository = inject(PostRepository)

  public getPostPreviews(
    limit: number = 3,
    offset: number = 0
  ): Observable<ApolloQueryResult<PostPreviewResponse>> {
    return this.apollo
      .watchQuery<PostPreviewResponse>({
        query: gql`
        query getPostPreviews {
          allPost(limit: ${limit}, offset: ${offset}, sort: [{_createdAt: DESC}]) {
            title
            _createdAt
            slug
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
      .valueChanges.pipe(
        tap(({data}): void => {
          this.repository.setPostPreviews({
            total: Infinity,
            perPage: offset,
            lastPage: Infinity,
            currentPage: offset / limit + 1,
            data: data.allPost
          })
        })
      )
  }

  public getPostSingle(
    slug: string
  ): Observable<ApolloQueryResult<PostSingleResponse>> {
    return this.apollo
      .watchQuery<PostSingleResponse>({
        query: gql`
        query getPost {
          allPost(where: {slug: {eq: "${slug}"}}) {
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
      .valueChanges.pipe(
        tap(({data}): void => {
          this.repository.setPostSingle(data.allPost[0])
        })
      )
  }

  public getFeaturedPosts(): Observable<
    ApolloQueryResult<FeaturedPostResponse>
  > {
    return this.apollo
      .watchQuery<FeaturedPostResponse>({
        query: gql`
          query getFeaturedPosts {
            allPost(where: {featured: {eq: true}}) {
              title
              slug
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
              featuredButtons {
                text
                url
                openInNewTab
              }
            }
          }
        `
      })
      .valueChanges.pipe(
        tap(({data}): void => {
          this.repository.setFeaturedPosts(data.allPost)
        })
      )
  }
}
