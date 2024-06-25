import {inject, Injectable} from '@angular/core'
import {Apollo, QueryRef} from 'apollo-angular'
import {gql} from '@apollo/client/core'

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
        query {
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
