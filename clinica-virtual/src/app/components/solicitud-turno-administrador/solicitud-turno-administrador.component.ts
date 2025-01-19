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
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitud-turno-administrador',
  standalone: true,
  imports: [ListaPacienteComponent,
    CabeceraComponent,
    CargaTurnoPacienteComponent,
    FiltroTurnosComponent
  ],
  templateUrl: './solicitud-turno-administrador.component.html',
  styleUrl: './solicitud-turno-administrador.component.css'
})
export class SolicitudTurnoAdministradorComponent {
  medicoSeleccionado: Medico | null = null;
  especialidad: string[] = [];
  mailEspecialista: string = '';
  nombreEspecialista: string = '';
  horarioSeleccionado: Horario | null = null;
  paciente: Paciente | null = null;
  uidPaciente: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  obtenerTurno(): void {
    if (this.medicoSeleccionado && this.horarioSeleccionado && this.paciente && this.especialidad) {
      const turno: Turno = {
        id: '', // ID se asignará automáticamente por Firestore
        idPaciente: this.paciente.uid, // Asignar el uid del paciente
        idHorario: this.horarioSeleccionado.id,
        especialidad: this.especialidad,
        mailEspecialista: this.mailEspecialista,
        nombreEspecialista: this.nombreEspecialista,
        comentario: 'Comentario opcional',
        estado: 'pendiente'
      };

      this.authService.saveTurno(turno).pipe(
        switchMap(() => {
          if (this.horarioSeleccionado) {
            return this.authService.updateHorarioOcupado(this.horarioSeleccionado);
          } else {
            return new Observable<void>((observer) => observer.complete());
          }
        })
      ).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Turno guardado y horario actualizado correctamente', 'success');
          console.log('Turno guardado y horario actualizado');
          this.router.navigate(['registrar/admin/menu']);
        },
        error: (error) => {
          Swal.fire('Error', 'Ocurrió un error al guardar el turno o actualizar el horario', 'error');
          console.error('Error al guardar el turno o actualizar el horario:', error);
        }
      });
    } else {
      Swal.fire('Advertencia', 'Seleccione un médico y un horario', 'warning');
    }
  }
  recibirMedicoSeleccionado(medico: Medico) {
    this.medicoSeleccionado = medico;
    console.log('Médico seleccionado en solicitudAdministrador:', medico);
    this.mailEspecialista = this.medicoSeleccionado.mail;
    this.nombreEspecialista = `${this.medicoSeleccionado.nombre} ${this.medicoSeleccionado.apellido}`;
  }
  recibirHorarioSeleccionado(horario: Horario) {
    this.horarioSeleccionado = horario;
    console.log('Horario seleccionado en solicitudAdministrador:', horario);
  }
  recibirPaciente(paciente: Paciente) {
    this.paciente = paciente;
    console.log('Paciente recibido en solicitudAdministrador:', paciente);
  }

 
  listartodo(): void {
    console.log('Disponibilidad del horario seleccionado:', this.horarioSeleccionado?.disponibilidad);
    console.log('Nombre del médico seleccionado:', this.medicoSeleccionado?.nombre);
    console.log('Nombre del paciente:', this.paciente?.nombre);
  }
  recibirEspecialidadSeleccionada(especialidad: any): void {
    this.especialidad = especialidad;
    console.log('Especialidad seleccionada recibida:', especialidad);
    // Aquí puedes agregar la lógica que necesites para manejar la especialidad seleccionada
  }
  

}

