import { Component } from '@angular/core';
import {Verificar } from '../../bibliotecas/verificar';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup,
   Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CasaComponent } from '../casa/casa.component';


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

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nombreRegister: ['', [Validators.required, Verificar.esNombreOApellidoValidator]],
      apellidoRegister: ['', [Validators.required, Verificar.esNombreOApellidoValidator]],
      emailRegister: ['', [Validators.required, Validators.email]],
      passwordRegister: ['', Validators.required],
      dniRegister: ['', [Validators.required, Verificar.dniValidator]],
      obraSocial: ['', Validators.required],
      edadRegister: ['', [Validators.required, Verificar.edadValidator(18, 65)]], // Ajusta los valores de edad mínima y máxima según sea necesario
      archivoRegister: ['', Validators.required],
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

  

}
