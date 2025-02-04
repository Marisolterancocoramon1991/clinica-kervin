import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlightChart]',
  standalone: true
})
export class HighlightChartDirective {

  @Input() highlightColor: string = 'lightblue'; // Color de resalte predeterminado

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor); // Resaltar al pasar el mouse
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null); // Quitar resalte al salir del mouse
  }

  private highlight(color: string | null) {
    this.el.nativeElement.style.boxShadow = color
      ? `0px 4px 15px ${color}`
      : 'none';
    this.el.nativeElement.style.transition = 'box-shadow 0.3s';
  }

}
