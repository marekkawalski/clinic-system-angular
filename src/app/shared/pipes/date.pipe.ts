import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
  standalone: true,
})
export class DatePipe implements PipeTransform {
  transform(value: any): any {
    if (!value) return '';
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    return value;
  }
}
