import { Component, Input, OnInit, OnChanges, SimpleChanges,Output, EventEmitter } from '@angular/core';
import { Turno } from '../../bibliotecas/turno.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Horario } from '../../bibliotecas/horarioEspecialista.interface';
import Swal from 'sweetalert2';

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
  
  horariosDisponibles: Horario[] = []; 
  @Output() horarioSeleccionado = new EventEmitter<Horario>();
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
  // Suponiendo que 'dia.dia' es una cadena que representa una fecha
  

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
  listarHorarios(): void {
    if (this.mailEspecialista) {
      this.authServices.getHorariosEspecialista(this.mailEspecialista).subscribe(
        horarios => {
          console.log('Horarios del especialista:', horarios);
  
          // Obtener la fecha de mañana
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
  
          // Filtrar los horarios por disponibilidad abierta y a partir de mañana
          this.horariosDisponibles = horarios.filter(horario => {
            const horarioDate = new Date(horario.dia);
            return horarioDate >= tomorrow && horario.disponibilidad === 'abierta';
          });
  
          // Mantener horaInicio y horaFin como strings si es necesario
        },
        error => {
          console.error('Error obteniendo horarios:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener los horarios. Por favor, inténtelo nuevamente más tarde.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }
  }
  
  
  // Suponiendo que 'dia.dia' es una cadena que representa una fecha
formatDate(fechaString: string): string {
  const fecha = new Date(fechaString);
  // Lógica para formatear 'fecha' como lo necesites (ej. usando DatePipe)
  // Aquí un ejemplo básico:
  return fecha.toLocaleDateString('es-ES'); // Formato de fecha según localización
}

cargarHorarioSeleccionado(horario: Horario): void {
  this.horarioSeleccionado.emit(horario);
}


}