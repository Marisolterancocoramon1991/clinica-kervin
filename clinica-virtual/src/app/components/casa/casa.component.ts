import { CommonModule } from '@angular/common';
import { Component, OnInit , EventEmitter,Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-casa',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  templateUrl: './casa.component.html',
  styleUrl: './casa.component.css'
})
export class CasaComponent implements OnInit{
  captchaImage: string = ''; // Inicialización directa en la declaración
  captchaCode: string = '';
  userInput: string = ''; // Asegurarse de inicializar también userInput si es necesario
  loading: boolean = false; 
  @Output() captchaValidated: EventEmitter<boolean> = new EventEmitter<boolean>();  

  ngOnInit(): void {
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    this.loading = true; // Activar el estado de carga

    // Simular un retardo para la generación de la imagen (puedes ajustar este valor según sea necesario)
    setTimeout(() => {
      // Lógica para generar un código CAPTCHA (por ejemplo, aleatorio)
      this.captchaCode = this.generateRandomCode(6);
      console.log(this.captchaCode);
      this.captchaImage = `https://via.placeholder.com/150?text=${this.captchaCode}`;
      
      this.loading = false; // Desactivar el estado de carga
    }, 1000); // Simular un retardo de 2 segundos para la generación del CAPTCHA
  }

  generateRandomCode(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  submitCaptcha(): void {
    // Verificar si el código ingresado coincide con el CAPTCHA generado
    const isValid = this.userInput === this.captchaCode;
    if (isValid) {
      Swal.fire({
        title: '¡CAPTCHA validado correctamente!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } else {
      Swal.fire({
        title: 'Código CAPTCHA incorrecto',
        text: 'Inténtelo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      this.userInput = '';
      this.generateCaptcha(); // Regenera un nuevo CAPTCHA
    }
    // Emitir el resultado del CAPTCHA
    this.captchaValidated.emit(isValid);
  }

  refreshComponent(): void {
    this.generateCaptcha(); // Método para regenerar el CAPTCHA al hacer clic en el botón de refrescar
    this.userInput = ''; // Limpia el input de usuario
  }
}
