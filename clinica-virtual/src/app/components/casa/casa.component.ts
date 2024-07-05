import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    if (this.userInput === this.captchaCode) {
      alert('¡CAPTCHA validado correctamente!');
      // Aquí puedes continuar con la lógica de tu aplicación después de validar el CAPTCHA
    } else {
      alert('Código CAPTCHA incorrecto. Inténtelo de nuevo.');
      this.userInput = '';
      // Aquí puedes manejar la lógica cuando el CAPTCHA es incorrecto
      this.generateCaptcha(); // Regenera un nuevo CAPTCHA
    }
  }

  refreshComponent(): void {
    this.generateCaptcha(); // Método para regenerar el CAPTCHA al hacer clic en el botón de refrescar
    this.userInput = ''; // Limpia el input de usuario
  }
}
