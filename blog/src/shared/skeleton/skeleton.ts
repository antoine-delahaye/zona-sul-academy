import { Component, computed, input } from '@angular/core';

/** Placeholder shown while Studio-managed text is still loading. */
@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.html',
  host: {
    class: 'block',
    role: 'status',
    'aria-busy': 'true',
  },
})
export class Skeleton {
  /** Number of placeholder lines to render. */
  readonly lines = input<number>(3);

  /** Fixed-length array to iterate over; the values themselves are unused. */
  readonly placeholders = computed(() =>
    Array.from({ length: Math.max(1, this.lines()) }, () => 0),
  );
}
