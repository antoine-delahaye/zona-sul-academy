import { Injectable, resource, inject } from '@angular/core';
import { SiteContent } from '../models/site-content.model';
import { SanityService } from './sanity.service';

@Injectable({
  providedIn: 'root',
})
export class SiteContentService {
  private sanity = inject(SanityService);

  private readonly _allSiteContent = resource({
    loader: async () => {
      const query = `
        *[_type == "siteContent"] {
          _id,
          title,
          slug,
          "subtitleRaw": subtitle,
          pageBuilder[] {
            _type,
            _key,
            _type == "imageSection" => {
              "__typename": "ImageSection",
              title,
              "bodyRaw": body,
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
            },
            _type == "videoSection" => {
              "__typename": "VideoSection",
              title,
              "bodyRaw": body,
              videoId
            },
            _type == "membershipSection" => {
              "__typename": "MembershipSection",
              title,
              "descriptionRaw": description,
              requirements,
              price,
              priceInfo,
              additionalInfo,
              buttonUrl,
              buttonText
            }
          }
        }
      `;
      const data = await this.sanity.fetchGROQ<SiteContent[]>(query);
      return data;
    },
  });

  public getAll() {
    return this._allSiteContent;
  }
}
