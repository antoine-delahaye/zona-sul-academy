import { Injectable, resource, inject } from '@angular/core';
import { SiteContent } from '../models/site-content.model';
import { GraphqlService } from './graphql.service';

@Injectable({
  providedIn: 'root',
})
export class SiteContentService {
  private graphql = inject(GraphqlService);

  private readonly _allSiteContent = resource({
    loader: async () => {
      const query = `
        query getAllSiteContent {
          allSiteContent {
            _id
            title
            slug
            subtitleRaw
            pageBuilder {
              ... on ImageSection {
                __typename
                _key
                title
                bodyRaw
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
              ... on VideoSection {
                __typename
                _key
                title
                bodyRaw
                videoId
              }
              ... on MembershipSection {
                __typename
                _key
                title
                descriptionRaw
                requirements
                price
                priceInfo
                additionalInfo
                buttonUrl
                buttonText
              }
            }
          }
        }
      `;
      const data = await this.graphql.fetchGraphQL<{ allSiteContent: SiteContent[] }>(query);
      return data.allSiteContent;
    },
  });

  public getAll() {
    return this._allSiteContent;
  }
}
