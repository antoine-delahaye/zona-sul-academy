import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hour',
})
export class HourPipe implements PipeTransform {
  public transform(value: string | number): string {
    return value.toString().replace(':', 'h');
  }
}
