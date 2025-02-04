import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {

  @Input('appTooltip') tooltipMessage: string = ''; // Mensaje del tooltip
  private tooltipElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (this.tooltipMessage) {
      this.showTooltip();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.removeTooltip();
  }

  private showTooltip() {
    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.appendChild(
      document.body,
      this.tooltipElement
    );
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background', '#333');
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
    if(this.tooltipElement)
    this.tooltipElement.innerText = this.tooltipMessage;

    const rect = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(
      this.tooltipElement,
      'top',
      `${rect.top - 30}px`
    );
    this.renderer.setStyle(
      this.tooltipElement,
      'left',
      `${rect.left}px`
    );
  }

  private removeTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }

}
