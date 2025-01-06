import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, 
  ReactiveFormsModule, FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { CasaComponent } from '../casa/casa.component';
import {  ValidationErrors, ValidatorFn } from '@angular/forms'


export function dniValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dni = control.value;
    return dni && dni.toString().length >= 6 ? null : { dniInvalido: true };
  };
}

// Validador personalizado para la edad (mayor a 25 años)
export function edadValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const edad = control.value;
    return edad && edad > 25 ? null : { edadInvalida: true };
  };
}


@Component({
  selector: 'app-registrar-medico',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule,
    CasaComponent
  ],
  templateUrl: './registrar-medico.component.html',
  styleUrl: './registrar-medico.component.css'
})
export class RegistrarMedicoComponent {
  nombre: string = '';
  apellido: string = '';
  mail: string = '';
  password: string = '';
  dni: number | null = null;
  edad: number | null = null;
  customEspecialidad: string = '';
  showCustomEspecialidadInput: boolean = false;
  archivoPerfil: File | null = null;
  especialidadesUno: string[] = [
    'Allergology', 'Anesthesiology', 'Cardiology', 'Dermatology', 'Endocrinology',
    'Gastroenterology', 'Geriatrics', 'Gynecology', 'Hematology', 'Infectology',
    'Internal Medicine', 'Nephrology', 'Pulmonology', 'Neurology', 'Nutrition',
    'Dentistry', 'Ophthalmology', 'Oncology', 'Orthopedics', 'Otolaryngology',
    'Pediatrics', 'Psychology', 'Psychiatry', 'Radiology', 'Rheumatology',
    'Traumatology', 'Urology'
  ];
  especialidades: string[] = [] ;
  validacion: boolean = false;

  registerForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      nombreRegister: ['', Validators.required],
      apellidoRegister: ['', Validators.required],
      emailRegister: ['', [Validators.required, Validators.email]],
      passwordRegister: ['', Validators.required],
      dniRegister: ['', [Validators.required, dniValidator()]], // Validador personalizado para DNI
      edadRegister: ['', [Validators.required, edadValidator()]],
      archivoRegister: ['', Validators.required],
    });
  }
 
  onEspecialidadCheckboxChange(especialidad: string, event: any): void {
    const checkbox = event.target;
    if (checkbox.checked) {
      this.especialidades.push(especialidad); // Add especialidad to array
    } else {
      const index = this.especialidades.indexOf(especialidad);
      if (index !== -1) {
        this.especialidades.splice(index, 1); // Remove especialidad from array
      }
    }
  }

  toggleCustomEspecialidadInput(): void {
    this.showCustomEspecialidadInput = true;
  }

  clearCustomEspecialidadInput(): void {
    this.showCustomEspecialidadInput = false;
    this.customEspecialidad = '';
  }

  addCustomEspecialidad(): void {
    if (this.customEspecialidad.trim() !== '') {
      this.especialidades.push(this.customEspecialidad.trim()); // Add custom especialidad to array
      this.customEspecialidad = ''; // Clear input field
    }
  }


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (input.files.length > 1) {
        Swal.fire({
          icon: 'warning',
          title: 'Error en Archivo',
          text: 'Solo puede seleccionar un archivo.',
        });
        this.archivoPerfil = null;
      } else {
        this.archivoPerfil = input.files[0];
      }
    } else {
      this.archivoPerfil = null;
    }
  }
  
  
  async registrarMedico(): Promise<void> {
    // Verificar si el CAPTCHA ha sido validado
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
    const dniControl = this.registerForm.get('dniRegister');
    const edadControl = this.registerForm.get('edadRegister');
  
    if (dniControl?.hasError('dniInvalido')) {
      await Swal.fire({
        icon: 'error',
        title: '¡DNI Inválido!',
        text: 'El DNI debe tener al menos 6 dígitos.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Entendido'
      });
      return;
    }
  
    if (edadControl?.hasError('edadInvalida')) {
      await Swal.fire({
        icon: 'error',
        title: '¡Edad Inválida!',
        text: 'La edad del especialista debe ser mayor a 25 años.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Entendido'
      });
      return;
    }
  
    // Verificar si el formulario es válido
    if (this.registerForm.valid) {
      const {
        nombreRegister,
        apellidoRegister,
        emailRegister,
        passwordRegister,
        dniRegister,
        edadRegister,
        archivoRegister
      } = this.registerForm.value;
  
      
  
      try {
        await this.authService.registerMedico(
          nombreRegister,
          apellidoRegister,
          emailRegister,
          passwordRegister,
          dniRegister,
          edadRegister,
          this.especialidades,
          this.archivoPerfil!
        );
  
        // Mostrar mensaje de éxito usando SweetAlert2
        await Swal.fire({
          icon: 'success',
          title: '¡Registro Completado!',
          text: '¡Te has registrado con éxito! Esperemos a la verificación del administrador y empieza a mejorar tu vida y la vida de otros.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: '¡Vamos allá!'
        });
        this.navigateToWelcome();
  
      } catch (error) {
        console.error('Error registrando Médico:', error);
        // Mostrar mensaje de error usando SweetAlert2
        await Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Hubo un problema al registrar al médico. Por favor, inténtalo de nuevo más tarde.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Entendido'
        });
      }
    } else {
      // Mostrar mensaje de campos incompletos usando SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: '¡Campos Incompletos!',
        text: 'Por favor, completa todos los campos requeridos y asegúrate de subir las dos imágenes necesarias para continuar.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Entendido'
      });
    }
  }
  
  
  navigateToWelcome() {
    this.router.navigateByUrl('/**');
  }
  recibirBooleano(validacion: boolean): void 
  {
    this.validacion = validacion;
  }


}
