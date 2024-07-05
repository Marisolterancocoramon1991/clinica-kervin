import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MisTurnosPacientesComponent } from '../mis-turnos-pacientes/mis-turnos-pacientes.component';
import { FiltroTurnosComponent } from '../filtro-turnos/filtro-turnos.component';
import { CargaTurnoPacienteComponent } from '../carga-turno-paciente/carga-turno-paciente.component';
import { Medico } from '../../bibliotecas/medico.interface';

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

  recibirMedicoSeleccionado(medico: Medico) {
    this.medicoSeleccionado = medico;
    console.log('Médico seleccionado en SolicitudTurnoComponent:', medico);
    this.especialidad = this.medicoSeleccionado.especialidades;
    this.mailEspecialista = this.medicoSeleccionado.mail;
    this.nombreEspecialista = `${this.medicoSeleccionado.nombre} ${this.medicoSeleccionado.apellido}`;
  }

  verificar()
  {
    alert(this.medicoSeleccionado?.apellido);
  }
  
}
