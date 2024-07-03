import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';

@Component({
  selector: 'app-registrar-admin',
  standalone: true,
  imports: [CommonModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  templateUrl: './registrar-admin.component.html',
  styleUrl: './registrar-admin.component.css'
})
export class RegistrarAdminComponent {
  nombre: string = '';
  apellido: string = '';
  mail: string = '';
  password: string = '';
  dni: number | null = null;
  edad: number | null = null;
  archivoPerfil: File | null = null;
  registerForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder){
    this.registerForm = this.fb.group({
      nombreRegister: ['', Validators.required],
      apellidoRegister: ['', Validators.required],
      emailRegister: ['', [Validators.required, Validators.email]],
      passwordRegister: ['', Validators.required],
      dniRegister: ['', Validators.required],
      edadRegister: ['', Validators.required],
      archivoRegister: ['', Validators.required],
    });
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoPerfil = input.files[0];
    }
  }

  async registrarAdmin(): Promise<void> {
    if (this.nombre.trim() !== "" && this.nombre != null && this.apellido.trim() !== "" && this.apellido != null && this.mail.trim() !== "" && this.mail != null && this.password.trim() !== "" && this.password != null && this.dni != null && this.dni > 0 && this.edad != null && this.edad > 0 && this.archivoPerfil != null) {
      try {
        await this.authService.registerAdmin(
          this.nombre,
          this.apellido,
          this.mail,
          this.password,
          this.dni!,
          this.edad!,
          this.archivoPerfil!
        );
        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: 'Te has Registrado Correctamente',
        });
      } catch (error) {
        console.error('Error registrando Administrador:', error);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Necesita Completar todos los Campos Requeridos',
      });
      return;
    }
  }

}
