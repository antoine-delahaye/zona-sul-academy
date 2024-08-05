import {inject, Injectable} from '@angular/core'
import {Apollo, gql} from 'apollo-angular'
import {ApolloQueryResult} from '@apollo/client'
import {Observable, tap} from 'rxjs'

import {
  PlanningEvent,
  PlanningEventRepository
} from '@repository/planning-event.repository'

type Response = {allPlanningEvent: PlanningEvent[]}

@Injectable({
  providedIn: 'root'
})
export class PlanningEventService {
  private apollo: Apollo = inject(Apollo)
  private repository: PlanningEventRepository = inject(PlanningEventRepository)

  public getAll(): Observable<ApolloQueryResult<Response>> {
    return this.apollo
      .watchQuery<Response>({
        query: gql`
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
        `
      })
      .valueChanges.pipe(
        tap(({data}): void => {
          this.repository.set(data.allPlanningEvent)
        })
      )
  }
}
