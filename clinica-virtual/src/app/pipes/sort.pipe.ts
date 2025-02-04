import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {

  transform(items: any[], property: string = '', order: 'asc' | 'desc' = 'asc'): any[] {
    if (!items || items.length === 0) return [];
    return items.sort((a, b) => {
      const comparison = property ? a[property].localeCompare(b[property]) : a.localeCompare(b);
      return order === 'asc' ? comparison : -comparison;
    });
  }

}
