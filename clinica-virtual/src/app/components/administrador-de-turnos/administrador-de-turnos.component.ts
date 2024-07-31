import { Component } from '@angular/core';
import { ListaPacienteComponent } from '../lista-paciente/lista-paciente.component';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { CargaTurnoPacienteComponent } from '../carga-turno-paciente/carga-turno-paciente.component';
import { FiltroTurnosComponent } from '../filtro-turnos/filtro-turnos.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Turno } from '../../bibliotecas/turno.interface';
import { switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { Medico } from '../../bibliotecas/medico.interface';
import { Horario } from '../../bibliotecas/horarioEspecialista.interface';
import { Paciente } from '../../bibliotecas/paciente.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-administrador-de-turnos',
  standalone: true,
  imports: [
    CabeceraComponent,
    FiltroTurnosComponent,
    CommonModule,

    
  ],
  templateUrl: './administrador-de-turnos.component.html',
  styleUrl: './administrador-de-turnos.component.css'
})
export class AdministradorDeTurnosComponent {
  medicoSeleccionado: Medico | null = null;
  especialidad: string[] = [];
  mailEspecialista: string = '';
  nombreEspecialista: string = '';
  paciente: Paciente | null = null;
  uidPaciente: string = '';
  turnosPorEspecialista: Turno[] = [];
  constructor(private authService: AuthService) {}
  recibirMedicoSeleccionado(medico: Medico) {
    this.medicoSeleccionado = medico;
    this.mailEspecialista = this.medicoSeleccionado.mail;
    this.nombreEspecialista = `${this.medicoSeleccionado.nombre} ${this.medicoSeleccionado.apellido}`;
  }
  recibirEspecialidadSeleccionada(especialidad: any): void {
    this.especialidad = especialidad;
  }

  obtenerTurnos(): void {
    if (this.mailEspecialista) {
      this.authService.getTurnosPorMailEspecialista(this.mailEspecialista).subscribe({
        next: (turnos) => {
          this.turnosPorEspecialista = turnos;
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudieron cargar los turnos', 'error');
        }
      });
    }
  }
  seleccionarTurno(turno: Turno): void {
    Swal.fire({
      title: 'Detalles del Turno',
      html: `<p><strong>Especialista:</strong> ${turno.nombreEspecialista}</p>
             <p><strong>Comentario:</strong> ${turno.comentario}</p>`,
      icon: 'info'
    });
  }
  cancelarTurno(turno: Turno): void {
    // Verificar el estado del turno
    if (turno.estado === 'pendiente') {
      // Mostrar SweetAlert2 para confirmar la cancelación del turno
      Swal.fire({
        title: 'Detalles del Turno',
        html: `<p><strong>Especialista:</strong> ${turno.nombreEspecialista}</p>
               <p><strong>Comentario:</strong> ${turno.comentario}</p>
               <p><strong>¿Estás seguro de que deseas cancelar este turno?</strong></p>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, mantener'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceder con la cancelación si el usuario confirma
          this.authService.updateTurnoCancelado(turno).subscribe({
            next: () => {
              Swal.fire('Éxito', 'El turno ha sido cancelado', 'success');
            },
            error: (error) => {
              Swal.fire('Error', 'No se pudo cancelar el turno', 'error');
              console.error('Error al cancelar el turno:', error);
            }
          });
        } else {
          // Informar al usuario que la cancelación fue abortada
          Swal.fire('Cancelado', 'El turno no fue cancelado', 'info');
        }
      });
    } else {
      // Informar al usuario que el turno no puede ser cancelado
      Swal.fire('Operación no permitida', `El turno está en estado '${turno.estado}' y solo se puede cancelar si está en estado 'pendiente'.`, 'warning');
    }
  }
}
