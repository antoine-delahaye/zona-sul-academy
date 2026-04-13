import { Injectable, resource, inject } from '@angular/core';
import { Media } from '../models/media.model';
import { GraphqlService } from './graphql.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private graphql = inject(GraphqlService);

  private readonly _allMedia = resource({
    loader: async () => {
      const query = `
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
      `;
      const data = await this.graphql.fetchGraphQL<{ allMedia: Media[] }>(query);
      return data.allMedia;
    },
  });

  public getAll() {
    return this._allMedia;
  }
}
