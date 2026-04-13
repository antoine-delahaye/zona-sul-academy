import { Injectable, resource, inject } from '@angular/core';
import { PlanningEvent } from '../models/planning-event.model';
import { GraphqlService } from './graphql.service';

@Injectable({
  providedIn: 'root',
})
export class PlanningEventService {
  private graphql = inject(GraphqlService);

  public getAll() {
    const query = `
      query getPlanningEvents {
        allPlanningEvent(sort: [{day: ASC}]) {
          _id
          title
          date
          day
          duration {
            start
            end
          }
          location
          person
        }
      }
    `;

    return resource({
      loader: async () => {
        const data = await this.graphql.fetchGraphQL<{ allPlanningEvent: PlanningEvent[] }>(query);
        return data.allPlanningEvent;
      },
    });
  }
}
