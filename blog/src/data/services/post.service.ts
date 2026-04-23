import { Injectable, resource, inject } from '@angular/core';
import { PostPreview, PostSingle, FeaturedPost } from '../models/post.model';
import { SanityService } from './sanity.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private sanity = inject(SanityService);

  public getPostPreviews(limit = 10, offset = 0) {
    return resource({
      loader: async () => {
        const query = `
          *[_type == "post"] | order(_createdAt desc) [${offset}...${offset + limit}] {
            title,
            _createdAt,
            slug,
            excerpt,
            mainImage {
              asset-> {
                altText,
                path,
                metadata {
                  dimensions {
                    width,
                    height
                  }
                }
              }
            }
          }
        `;
        const data = await this.sanity.fetchGROQ<PostPreview[]>(query);
        return data;
      },
    });
  }

  public getPostSingle(slug: string) {
    return resource({
      loader: async () => {
        const query = `
          *[_type == "post" && slug == "${slug}"] {
            title,
            _createdAt,
            mainImage {
              asset-> {
                altText,
                path,
                metadata {
                  dimensions {
                    width,
                    height
                  }
                }
              }
            },
            "bodyRaw": body[] {
              _type,
              _key,
              style,
              children[] {
                text,
                _type,
                _key
              }
            }
          }
        `;
        const data = await this.sanity.fetchGROQ<PostSingle[]>(query);
        return data[0];
      },
    });
  }

  public getFeaturedPosts() {
    return resource({
      loader: async () => {
        const query = `
          *[_type == "post" && featured == true] {
            title,
            slug,
            excerpt,
            mainImage {
              asset-> {
                altText,
                path,
                metadata {
                  dimensions {
                    width,
                    height
                  }
                }
              }
            },
            featuredButtons[] {
              text,
              url,
              openInNewTab
            }
          }
        `;
        const data = await this.sanity.fetchGROQ<FeaturedPost[]>(query);
        return data;
      },
    });
  }
}
