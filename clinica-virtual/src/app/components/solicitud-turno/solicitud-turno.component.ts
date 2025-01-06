import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MisTurnosPacientesComponent } from '../mis-turnos-pacientes/mis-turnos-pacientes.component';
import { FiltroTurnosComponent } from '../filtro-turnos/filtro-turnos.component';
import { CargaTurnoPacienteComponent } from '../carga-turno-paciente/carga-turno-paciente.component';
import { Medico } from '../../bibliotecas/medico.interface';
import Swal from 'sweetalert2';
import { Paciente } from '../../bibliotecas/paciente.interface';
import { Horario } from '../../bibliotecas/horarioEspecialista.interface';
import { Turno } from '../../bibliotecas/turno.interface';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs'
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitud-turno',
  standalone: true,
  imports: [CommonModule,
    MisTurnosPacientesComponent,
    FiltroTurnosComponent,
    CargaTurnoPacienteComponent
  ],
  templateUrl: './solicitud-turno.component.html',
  styleUrl: './solicitud-turno.component.css'
})
export class SolicitudTurnoComponent {
  medicoSeleccionado: Medico | null = null;
  especialidad: string[] = [];
  mailEspecialista: string = '';
  nombreEspecialista: string = '';
  horarioSeleccionado: Horario | null = null;
  constructor(private authService: AuthService, private router: Router){}
  gotomMenu()
  {
    this.router.navigateByUrl('menu/paciente')
  }


  recibirMedicoSeleccionado(medico: Medico) {
    this.medicoSeleccionado = medico;
    console.log('Médico seleccionado en SolicitudTurnoComponent:', medico);
    this.mailEspecialista = this.medicoSeleccionado.mail;
    this.nombreEspecialista = `${this.medicoSeleccionado.nombre} ${this.medicoSeleccionado.apellido}`;
  }
  recibirEspecialidad(especialidad: any) {  // Cambiado a 'any'
    this.especialidad = especialidad;
    console.log("estoy en recibirEspecialidad en soliciutud turno");
  }
  verificar()
  {
    alert(this.medicoSeleccionado?.apellido);
  }
  recibirHorarioSeleccionado(horario: Horario) {
    this.horarioSeleccionado = horario;
    console.log('Horario seleccionado en solicitudTurno:', horario);
  }
  obtenerTurno(): void {
    // Obtener el usuario actual
    this.authService.getCurrentUser().subscribe(user => {
      if (user && this.medicoSeleccionado && this.horarioSeleccionado && this.especialidad) {
        const turno: Turno = {
          id: '', // ID se asignará automáticamente por Firestore
          idPaciente: user.uid, // Asignar el uid del paciente
          idHorario: this.horarioSeleccionado.id,
          especialidad: this.especialidad, // Debe ser un array de strings
          mailEspecialista: this.mailEspecialista,
          nombreEspecialista: this.nombreEspecialista,
          comentario: 'Comentario opcional',
          estado: 'pendiente' // Asegúrate de que este valor esté en la lista de estados permitidos
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
            // Imprimir el UID del usuario actual para verificar
            this.gotomMenu();
            console.log('ID del paciente:', user.uid);

          },
          error: (error) => {
            Swal.fire('Error', 'Ocurrió un error al guardar el turno o actualizar el horario', 'error');
            console.error('Error al guardar el turno o actualizar el horario:', error);
          }
        });
      } else {
        Swal.fire('Advertencia', 'Seleccione un médico y un horario', 'warning');
      }
    });
  }
}
