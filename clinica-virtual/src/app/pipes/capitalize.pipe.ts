import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true
})
export class CapitalizePipe implements PipeTransform {

  private readonly excepciones = ['de', 'la', 'del', 'y', 'en', 'el', 'los', 'las'];

  transform(value: string): string {
    if (!value) return '';

    return value
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (index === 0 || !this.excepciones.includes(word)) {
          return this.formatWord(word); // Aplica formato a palabras que no sean excepciones
        }
        return word; // Mantén las palabras en la lista de excepciones en minúsculas
      })
      .join(' ');
  }

  private formatWord(word: string): string {
    if (!word) return '';
    const firstLetter = `<span style="font-family: 'Times New Roman', serif; font-weight: bold;">${word.charAt(0).toUpperCase()}</span>`;
    const restOfWord = word.slice(1);
    return `${firstLetter}${restOfWord}`;
  }

}
