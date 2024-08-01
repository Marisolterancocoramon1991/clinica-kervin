import { Component, OnInit } from '@angular/core';
import { FiltroTurnosComponent } from '../filtro-turnos/filtro-turnos.component';
import { Medico } from '../../bibliotecas/medico.interface';
import { Paciente } from '../../bibliotecas/paciente.interface';
import { AuthService } from '../../services/auth.service';
import { Turno } from '../../bibliotecas/turno.interface';
import { switchMap } from 'rxjs';
import {  User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Calificacion } from '../../bibliotecas/calificacion.interface';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ComentarioPaciente } from '../../bibliotecas/comenatrioPaciente.interface';
import { HistoriaClinica } from '../../bibliotecas/historiaClinica.interface';
import { PdfService } from '../../services/pdf.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-mi-perfil-paciente-sprint3',
  standalone: true,
  imports: [
    FiltroTurnosComponent,
    CommonModule

  ],
  templateUrl: './mi-perfil-paciente-sprint3.component.html',
  styleUrl: './mi-perfil-paciente-sprint3.component.css'
})
export class MiPerfilPacienteSprint3Component {
  medicoSeleccionado: Medico | null = null;
  especialidad: string = '';
  mailEspecialista: string = '';
  nombreEspecialista: string = '';
  paciente: Paciente | null = null;
  turnos: Turno[] = [];
  currentUser: User | null = null;
  pacienteEnTurno: Paciente | null = null; 
  historiasClinicas: HistoriaClinica[] = [];
  userProfile1ImageUrl: string | null = null;
  animar = false;
  constructor(private authService: AuthService, private pdfService: PdfService){}

  ngOnInit(): void {
    this.authService.getCurrentUser().pipe(
      switchMap(user => {
        this.currentUser = user;
        
        if (user && user.email) {
          return this.authService.getUserDataByMail(user.email);
        } else {
          return new Observable<Paciente | null>(observer => {
            observer.next(null);
            observer.complete();
          });
        }
      })
    ).subscribe(userData => {
      console.log('Usuario actual:', this.currentUser);
      console.log('Datos del paciente obtenidos:', userData);
  
      if (userData) {
        this.pacienteEnTurno = userData;
        this.userProfile1ImageUrl = userData.profileImage ? userData.profileImage[0] : null;
      } else {
        console.log('No se encontraron datos de paciente.');
      }
    });
  }


  recibirEspecialidadSeleccionada(especialidad: any): void {
    this.especialidad = especialidad;
    console.log('Especialidad seleccionada recibida:', especialidad);
    // Aquí puedes agregar la lógica que necesites para manejar la especialidad seleccionada
  }
  

  recibirMedicoSeleccionado(medico: Medico) {
    this.medicoSeleccionado = medico;
  }

  obtenerTurnosYGenerarPdf(): void {
    this.animar = true;
    setTimeout(() => {
      this.animar = false;
    }, 2000);

    if (this.pacienteEnTurno && this.medicoSeleccionado && this.especialidad) {
      this.authService.getTurnosPorPacienteEspecialistaYEspecialidad(
        this.pacienteEnTurno,
        this.medicoSeleccionado,
        this.especialidad
      ).pipe(
        switchMap(turnos => {
          this.turnos = turnos;
          console.log('Turnos obtenidos:', this.turnos);
  
          // Obtener las historias clínicas para todos los turnos
          const historiasClinicasObservables = this.turnos.map(turno =>
            this.authService.getHistoriaClinicaPorTurno(turno.id)
          );
  
          // Ejecutar todas las solicitudes simultáneamente
          return forkJoin(historiasClinicasObservables);
        })
      ).subscribe(historiales => {
        // Iterar sobre cada array de historias clínicas para generar un PDF por historia clínica
        historiales.forEach(historiaClinicaArray => {
          historiaClinicaArray.forEach(historiaClinica => {
            if(this.pacienteEnTurno && this.medicoSeleccionado)
            this.pdfService.generatePdf(this.pacienteEnTurno, this.medicoSeleccionado, historiaClinica);
          });
        });
      });
    } else {
      console.log('No se puede obtener turnos, falta información.');
    }
  }
  
}
