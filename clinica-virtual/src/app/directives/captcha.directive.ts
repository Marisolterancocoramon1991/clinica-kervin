import { Directive, ElementRef, Renderer2, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appCaptcha]',
  standalone: true
})
export class CaptchaDirective {
  private captchaCode: string = '';
  
  @Output() captchaValidated = new EventEmitter<boolean>();

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.generateCaptcha();
  }

  // Generar un código captcha aleatorio
  private generateCaptcha(): void {
    this.captchaCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.renderer.setProperty(this.el.nativeElement, 'innerText', `Captcha: ${this.captchaCode}`);
  }

  // Escuchar el evento de entrada del usuario
  @HostListener('input', ['$event'])
  validateCaptcha(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const userInput = inputElement.value.toUpperCase();
    
    // Emitir si el captcha es válido o no
    this.captchaValidated.emit(userInput === this.captchaCode);
  }

}
