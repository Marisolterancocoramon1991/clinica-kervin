import { Component } from '@angular/core';
import {Verificar } from '../../bibliotecas/verificar';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup,
   Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CasaComponent } from '../casa/casa.component';
import {  ValidationErrors, ValidatorFn } from '@angular/forms'
import { Router } from '@angular/router';

export function esNombreOApellidoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo permite letras y espacios
    return value && regex.test(value) ? null : { nombreOApellidoInvalido: true };
  };
}

// Validador para verificar que el DNI tenga al menos 6 dígitos
export function dniValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dni = control.value;
    return dni && dni.toString().length >= 6 ? null : { dniInvalido: true };
  };
}

// Validador para verificar que la edad esté dentro de un rango (ejemplo: 18-100)
export function edadValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const edad = control.value;
    return edad && edad >= min && edad <= max ? null : { edadInvalida: true };
  };
}


@Component({
  selector: 'app-registrar-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    CasaComponent, 
  ],
  templateUrl: './registrar-paciente.component.html',
  styleUrl: './registrar-paciente.component.css'
})
export class RegistrarPacienteComponent {
  nombre: string = '';
  apellido: string = '';
  mail: string = '';
  password: string = '';
  dni: number | null = null;
  edad: number | null = null;
  obraSocial: string = ''; 
  archivoPerfil: File[] = [];
  validacion: boolean = false;
  registerForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      nombreRegister: ['', [Validators.required, esNombreOApellidoValidator()]], // Nombre requerido y validado
      apellidoRegister: ['', [Validators.required, esNombreOApellidoValidator()]], // Apellido requerido y validado
      emailRegister: ['', [Validators.required, Validators.email]], // Correo requerido y validación de formato
      passwordRegister: ['', Validators.required], // Contraseña requerida
      dniRegister: ['', [Validators.required, dniValidator()]], // Validador personalizado para DNI
      obraSocial: ['', Validators.required], // Obra social requerida
      edadRegister: ['', [Validators.required, edadValidator(18, 100)]], // Validador personalizado para edad (18 a 100)
      archivoRegister: ['', Validators.required], // Archivo requerido
    });
  }
  

  onFileChange(event: any) {
    this.archivoPerfil = event.target.files;
  }

  async registrarPaciente(): Promise<void> {
    if (!this.validacion) {
      await Swal.fire({
        icon: 'warning',
        title: '¡CAPTCHA No Validado!',
        text: 'Por favor, valida el CAPTCHA antes de continuar.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
      return; // Salir de la función si el CAPTCHA no ha sido validado
    }
    // Asigna los valores del formulario a las propiedades de la clase
    this.nombre = this.registerForm.get('nombreRegister')?.value;
    this.apellido = this.registerForm.get('apellidoRegister')?.value;
    this.mail = this.registerForm.get('emailRegister')?.value;
    this.password = this.registerForm.get('passwordRegister')?.value;
    this.dni = this.registerForm.get('dniRegister')?.value;
    this.edad = this.registerForm.get('edadRegister')?.value;
    this.obraSocial = this.registerForm.get('obraSocial')?.value;
  
    if (this.archivoPerfil.length == 2) {
      alert(
        `${this.nombre}, 
        ${this.apellido}, 
        ${this.mail}, 
        ${this.password}, 
        ${this.dni}, 
        ${this.edad}, 
        ${this.obraSocial}`
      );
      
      try {
        await this.authService.registerPaciente(
          this.nombre,
          this.apellido,
          this.mail,
          this.password,
          this.dni!,
          this.edad!,
          this.obraSocial,
          this.archivoPerfil[0],
          this.archivoPerfil[1]
        );
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'En breve recibirá un correo electrónico para verificar su cuenta.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
        
      } catch (error) {
        console.error('Error registrando Paciente:', error);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe completar todos los campos requeridos y subir las dos imágenes.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
      return;
    }
  }

  recibirBooleano(validacion: boolean): void 
  {
    this.validacion = validacion;
  }

  navigateToWelcome() {
    this.router.navigateByUrl('/**');
  }


}
