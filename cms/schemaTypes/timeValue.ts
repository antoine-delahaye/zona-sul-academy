import { defineType } from 'sanity';

const FIRST_HOUR = 6;
const LAST_HOUR = 24;
const STEP_MINUTES = 15;

/** Selectable times, in 15-minute steps from 06:00 up to 23:45. */
function allowedTimes(): string[] {
  const times: string[] = [];

  for (let hour = FIRST_HOUR; hour < LAST_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += STEP_MINUTES) {
      times.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }

  return times;
}

export default defineType({
  name: 'timeValue',
  title: 'Time',
  type: 'string',
  options: {
    list: allowedTimes(),
  },
});
