import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastProperty',
  standalone: true,
})
export class LastPropertyPipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) return '';
    return value.split('.').pop() ?? '';
  }
}
