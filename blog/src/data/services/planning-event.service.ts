import { Injectable, resource, inject } from '@angular/core';
import { PlanningEvent } from '../models/planning-event.model';
import { SanityService } from './sanity.service';

@Injectable({
  providedIn: 'root',
})
export class PlanningEventService {
  private sanity = inject(SanityService);

  public getAll() {
    return resource({
      loader: async () => {
        const query = `
          *[_type == "planningEvent"] | order(day asc) {
            _id,
            title,
            date,
            day,
            duration {
              start,
              end
            },
            location,
            person
          }
        `;
        const data = await this.sanity.fetchGROQ<PlanningEvent[]>(query);
        return data;
      },
    });
  }
}
