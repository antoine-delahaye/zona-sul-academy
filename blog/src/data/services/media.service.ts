import { Injectable, resource, inject } from '@angular/core';
import { Media } from '../models/media.model';
import { SanityService } from './sanity.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private sanity = inject(SanityService);

  private readonly _allMedia = resource({
    loader: async () => {
      const query = `
        *[_type == "media"] {
          _id,
          title,
          slug,
          image {
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
      const data = await this.sanity.fetchGROQ<Media[]>(query);
      return data;
    },
  });

  public getAll() {
    return this._allMedia;
  }
}
