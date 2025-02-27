import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CuestionarioPaciente } from '../../bibliotecas/Cuestionario.interface'; 
import { CommonModule } from '@angular/common';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { Paciente } from '../../bibliotecas/paciente.interface';
import { Turno } from '../../bibliotecas/turno.interface';
import { AuthService } from '../../services/auth.service';
import { user } from '@angular/fire/auth';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta-satisfaccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CabeceraComponent],
  templateUrl: './encuesta-satisfaccion.component.html',
  styleUrl: './encuesta-satisfaccion.component.css'
})
export class EncuestaSatisfaccionComponent implements OnInit {
 encuestaForm: FormGroup;
  cuestionario: CuestionarioPaciente | null = null;
  currentUser: any;
  pacienteActual: Paciente | null = null;
  turnosPaciente: Turno[] = [];
  turnoSeleccionado: Turno | null = null;
  @Input() turno: Turno | null = null;
  @Input() Paciente: Paciente | null = null;
  @Output() encuestaCargada: EventEmitter<any> = new EventEmitter<any>();



  constructor(private router: Router, private fb: FormBuilder,private authService: AuthService) {
    this.encuestaForm = this.fb.group({
      comentarios: ['', [Validators.required, Validators.minLength(10)]], // Campo obligatorio con mínimo de caracteres
      calificacion: [0, [Validators.required, Validators.min(1)]], // Debe ser mayor o igual a 1
      recomendacion: ['', Validators.required], // Campo obligatorio
      aspectos: this.fb.group({
        trato: [false],
        tiempoEspera: [false],
        instalaciones: [false],
      }), // Checkboxes no requeridos
      satisfaccion: [5, [Validators.required, Validators.min(1), Validators.max(10)]], // Rango entre 1 y 10
    });
  }

  ngOnInit(): void {
    console.log("entra");
      this.turnoSeleccionado = this.turno;
      this.pacienteActual= this.Paciente;
      console.log( this.turnoSeleccionado +"se ha cargadpd  de forma correcta el turno");
      console.log( this.pacienteActual +"se ha cargadpd  de forma correcta el paciente");
    

  }

  calificar(estrellas: number) {
    this.encuestaForm.patchValue({ calificacion: estrellas });
  }
 
  enviarEncuesta() {
    // Validar si el formulario es válido antes de procesar los datos
    if (this.encuestaForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos antes de enviar.',
      });
      console.log('Errores del formulario:', this.encuestaForm.errors);
      return;
    }
    
      this.cuestionario = this.encuestaForm.value as CuestionarioPaciente;
      if(this.cuestionario){
      this.cuestionario.idTurno = this.turnoSeleccionado?.id || null; // Manejar null si no hay turno seleccionado
  
      if (!this.cuestionario.idTurno) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe seleccionar un turno antes de enviar la encuesta.',
        });
        return;
      }
  
      this.authService.buscarEncuestaPorTurno(this.cuestionario.idTurno).subscribe(existe => {
        if (existe) {
          Swal.fire({
            icon: 'error',
            title: 'Encuesta ya registrada',
            text: 'Ya existe una encuesta para este turno.',
          });
          this.encuestaCargada.emit(true);
        } else {
          if(this.cuestionario)
          this.authService.saveEncuesta(this.cuestionario).subscribe({
            next: () => {
              this.encuestaCargada.emit(true);
              Swal.fire({
                icon: 'success',
                title: '¡Encuesta enviada!',
                text: '¡Gracias por completar la encuesta!'
              });
              
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error al enviar la encuesta',
                text: 'Intenta nuevamente más tarde.',
              });
              console.error('Error al guardar la encuesta:', error);
            }
          });
        }
      });
    }
  }

  cargarturno(turno: Turno){
    this.turnoSeleccionado = turno;
    console.log("el turno selesccionado:" + this.turnoSeleccionado.id)
  }


}
