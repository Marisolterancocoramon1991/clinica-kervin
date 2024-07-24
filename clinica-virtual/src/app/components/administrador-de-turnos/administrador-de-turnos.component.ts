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

@Component({
  selector: 'app-administrador-de-turnos',
  standalone: true,
  imports: [
    CabeceraComponent,
    FiltroTurnosComponent,
    
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
  constructor(private authService: AuthService) {}
  recibirMedicoSeleccionado(medico: Medico) {
    this.medicoSeleccionado = medico;
    this.mailEspecialista = this.medicoSeleccionado.mail;
    this.nombreEspecialista = `${this.medicoSeleccionado.nombre} ${this.medicoSeleccionado.apellido}`;
  }
  recibirEspecialidadSeleccionada(especialidad: any): void {
    this.especialidad = especialidad;
  }

}
