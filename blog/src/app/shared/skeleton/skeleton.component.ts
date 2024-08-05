import {Component} from '@angular/core'

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [],
  templateUrl: 'skeleton.component.html',
  styles: `
    :host {
      @apply flex w-full flex-col gap-4 *:skeleton *:h-4;
    }
  `
})
export class SkeletonComponent {}
