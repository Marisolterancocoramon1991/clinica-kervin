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
import { Router } from '@angular/router';


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
  constructor(private router: Router, private authService: AuthService) {}
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
      // Mostrar SweetAlert2 para obtener el comentario de cancelación
      Swal.fire({
        title: 'Cancelar Turno',
        html: `
          <p><strong>Especialista:</strong> ${turno.nombreEspecialista}</p>
          <p><strong>Especialidad:</strong> ${turno.especialidad}</p>
          <p><strong>Por favor, indique el motivo de la cancelación:</strong></p>
        `,
        input: 'textarea', // Campo para ingresar el comentario
        inputPlaceholder: 'Escriba su comentario aquí...',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Cancelar Turno',
        cancelButtonText: 'No cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debe ingresar un comentario para continuar.';
          }
          return null;
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          // Actualizar el comentario del turno con el motivo ingresado
          turno.comentario = result.value;
          turno.estado = 'cancelado'; // Cambiar el estado del turno a cancelado
  
          // Llamar al servicio para actualizar el turno
          this.authService.updateTurnoCancelado(turno).subscribe({
            next: () => {
              Swal.fire('Éxito', 'El turno ha sido cancelado exitosamente.', 'success');
              // Redirigir al usuario o actualizar la vista
              this.router.navigate(['registrar/admin/menu']);
            },
            error: (error) => {
              Swal.fire('Error', 'No se pudo cancelar el turno.', 'error');
              console.error('Error al cancelar el turno:', error);
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelado', 'El turno no fue cancelado.', 'info');
        }
      });
    } else {
      // Informar al usuario que el turno no puede ser cancelado
      Swal.fire(
        'Operación no permitida',
        `El turno está en estado '${turno.estado}' y solo se puede cancelar si está en estado 'pendiente'.`,
        'warning'
      );
    }
  }
  
}
