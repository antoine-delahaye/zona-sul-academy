import {inject, Injectable} from '@angular/core'
import {Apollo, QueryRef, gql} from 'apollo-angular'

export type PlanningEvent = {
  _id: string
  title: string
  date?: Date
  day?: string
  duration: {start: string; end: string}
  location: string
  person: string
}

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private apollo: Apollo = inject(Apollo)

  public get(): QueryRef<{allPlanningEvent: PlanningEvent[]}> {
    return this.apollo.watchQuery<{allPlanningEvent: PlanningEvent[]}>({
      query: gql`
        query getPlanningEvents {
          allPlanningEvent {
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
      `
    })
  }
}
