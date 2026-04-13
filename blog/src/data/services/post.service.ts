import { Injectable, resource, inject } from '@angular/core';
import { PostPreview, PostSingle, FeaturedPost } from '../models/post.model';
import { GraphqlService } from './graphql.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private graphql = inject(GraphqlService);

  public getPostPreviews(limit: number = 3, offset: number = 0) {
    const query = `
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
    `;

    return resource({
      loader: async () => {
        const data = await this.graphql.fetchGraphQL<{ allPost: PostPreview[] }>(query);
        return data.allPost;
      },
    });
  }

  public getPostSingle(slug: string) {
    const query = `
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
          bodyRaw {
            _type
            _key
            style
            children {
              text
              _type
              _key
            }
          }
        }
      }
    `;

    return resource({
      loader: async () => {
        const data = await this.graphql.fetchGraphQL<{ allPost: PostSingle[] }>(query);
        return data.allPost[0];
      },
    });
  }

  public getFeaturedPosts() {
    const query = `
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
    `;

    return resource({
      loader: async () => {
        const data = await this.graphql.fetchGraphQL<{ allPost: FeaturedPost[] }>(query);
        return data.allPost;
      },
    });
  }
}
