import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeSpaceBetween',
  standalone: true,
})
export class CapitalizeSpaceBetweenPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    let result = value.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}
