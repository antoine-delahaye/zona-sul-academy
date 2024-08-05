import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'hour',
  standalone: true
})
export class HourPipe implements PipeTransform {
  transform(value: string): unknown {
    return value.toString().replace(':', 'h')
  }
}
