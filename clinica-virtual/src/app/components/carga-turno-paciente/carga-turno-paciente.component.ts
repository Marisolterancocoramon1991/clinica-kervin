import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Turno } from '../../bibliotecas/turno.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-carga-turno-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './carga-turno-paciente.component.html',
  styleUrl: './carga-turno-paciente.component.css'
})
export class CargaTurnoPacienteComponent implements OnInit, OnChanges {
  @Input() especialidad: string[] = [];
  @Input() mailEspecialista: string = '';
  @Input() nombreEspecialista: string = '';

  turnoForm!: FormGroup;  
  mostrarFormulario = false;
  mensajeError: string | null = null;

  constructor(private fb: FormBuilder, private authServices: AuthService) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['especialidad'] || changes['mailEspecialista']) {
      this.updateFormFields();
    }
  }
  

  private initForm(): void {
    this.turnoForm = this.fb.group({
      id: ['', Validators.required],
      idPaciente: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      especialidad: ['', Validators.required],
      mailEspecialista: ['', [Validators.required, Validators.email]],
      comentario: [''],
      estado: ['pendiente', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.turnoForm.valid) {
      const turno: Turno = this.turnoForm.value;
      this.authServices.setTurno(turno).pipe(
        catchError(error => {
          this.mensajeError = 'Ocurrió un error al cargar el turno';
          return of();
        })
      ).subscribe(() => {
        console.log('Turno cargado exitosamente:', turno);
        this.turnoForm.reset();
        this.mostrarFormulario = false;
      });
    }
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  private updateFormFields(): void {
    this.turnoForm.patchValue({
      especialidad: this.especialidad,
      mailEspecialista: this.mailEspecialista,
      // Puedes actualizar otros campos aquí si es necesario
    });
  }
}