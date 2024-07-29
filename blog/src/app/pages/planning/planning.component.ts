import {Component, inject, OnInit} from '@angular/core'
import {AsyncPipe, DatePipe, NgClass, NgTemplateOutlet} from '@angular/common'

import {PlanningEventService} from '@service/planning-event.service'
import {
  PlanningEvent,
  PlanningEventRepository
} from '@src/app/data/repositories/planning-event.repository'

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [DatePipe, NgClass, AsyncPipe, NgTemplateOutlet],
  templateUrl: 'planning.component.html',
  styles: `
    :host {
      @apply flex h-full flex-col pb-8 lg:p-16 lg:px-32;
    }
  `
})
export class PlanningComponent implements OnInit {
  private planningEventService: PlanningEventService =
    inject(PlanningEventService)
  private planningEventRepository: PlanningEventRepository = inject(
    PlanningEventRepository
  )

  protected currentDate: Date = new Date()
  protected daysOfTheWeek: Date[] = []
  // array of hours for the day, from 6am to 11pm
  protected hoursOfTheDay: number[] = Array.from(
    {length: 19},
    (_v, k: number) => k + 6
  )
  protected events: PlanningEvent[] = []
  protected selectedDay: number = this.currentDate.getDay()

  public ngOnInit(): void {
    // Generate an array of dates for the current week, starting from Monday
    const currentDay: number = this.currentDate.getDay()
    const monday: Date = new Date(this.currentDate)
    monday.setDate(monday.getDate() - currentDay + (currentDay === 0 ? -6 : 1))
    for (let i: number = 0; i < 7; i++) {
      this.daysOfTheWeek.push(new Date(monday))
      monday.setDate(monday.getDate() + 1)
    }

    this.planningEventService.getAll().subscribe({
      next: ({loading}): void => {
        if (!loading) {
          this.events = this.planningEventRepository.getAll()
        }
      }
    })
  }

  protected getGridPosition(timeStart: string, timeEnd: string): string {
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    }

    const calculatePosition = (timeInMinutes: number): number => {
      const position: number =
        timeInMinutes > 360 ? (timeInMinutes - 360) / 5 : 0
      return position + 2
    }

    const calculateHeight = (
      startTimeInMinutes: number,
      endTimeInMinutes: number
    ): number => {
      const height: number = endTimeInMinutes - startTimeInMinutes
      return height > 360 ? 360 / 5 : height / 5
    }

    const startTimeInMinutes: number = timeToMinutes(timeStart)
    const endTimeInMinutes: number = timeToMinutes(timeEnd)

    const position: number = calculatePosition(startTimeInMinutes)
    const height: number = calculateHeight(startTimeInMinutes, endTimeInMinutes)

    return `${position} / span ${height}`
  }

  protected getDateFromHour(hour: string): Date {
    return new Date(`${this.currentDate.toDateString()} ${hour}`)
  }

  protected readonly Number: NumberConstructor = Number
}
