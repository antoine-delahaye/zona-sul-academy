import {Injectable} from '@angular/core'
import {createStore} from '@ngneat/elf'
import {getAllEntities, setEntities, withEntities} from '@ngneat/elf-entities'

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
export class PlanningEventRepository {
  public store = createStore(
    {name: 'planingEvents'},
    withEntities<PlanningEvent, '_id'>({
      idKey: '_id'
    })
  )

  public getAll(): PlanningEvent[] {
    return this.store.query(getAllEntities())
  }

  public set(planningEvents: PlanningEvent[]): void {
    this.store.update(setEntities(planningEvents))
  }
}
