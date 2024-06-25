import {defineType} from 'sanity'

export const timeValue = defineType({
  name: 'timeValue',
  title: 'Time',
  type: 'string',
  options: {
    list: ALLOWED_TIMES(),
  },
})

// A function that generates an array of times from 00:00 to 23:30
export function ALLOWED_TIMES() {
  const times: string[] = []
  for (let h: number = 6; h < 24; h++) {
    for (let m: number = 0; m < 60; m += 15) {
      times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
    }
  }
  return times
}