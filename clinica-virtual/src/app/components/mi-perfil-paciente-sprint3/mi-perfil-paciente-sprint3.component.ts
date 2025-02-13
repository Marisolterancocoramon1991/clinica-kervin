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
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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

  // Detener la animación después de 2 segundos
  setTimeout(() => {
    this.animar = false;
  }, 2000);

  // Validar que toda la información esté presente
  if (!this.pacienteEnTurno || !this.medicoSeleccionado || !this.especialidad) {
    Swal.fire({
      icon: 'error',
      title: 'Información incompleta',
      text: 'No se puede obtener turnos, falta información requerida.',
    });
    return;
  }

  Swal.fire({
    icon: 'info',
    title: 'Obteniendo turnos',
    text: 'Por favor, espera mientras se consultan los turnos.',
    timer: 2000,
    showConfirmButton: false
  });

  // Obtener turnos
  this.authService
    .getTurnosPorPacienteEspecialistaYEspecialidad(this.pacienteEnTurno, this.medicoSeleccionado, this.especialidad)
    .pipe(
      switchMap(turnos => {
        if (!turnos || turnos.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Sin turnos',
            text: 'No se encontraron turnos para los criterios seleccionados.',
          });
          return of([]);
        }

        this.turnos = turnos;
        console.log('Turnos obtenidos:', this.turnos);

        // Obtener las historias clínicas de los turnos
        const historiasClinicasObservables = this.turnos.map(turno =>
          this.authService.getHistoriaClinicaPorTurno(turno.id).pipe(
            catchError(error => {
              console.error(`Error al obtener la historia clínica para el turno ${turno.id}:`, error);
              return of(null); // Retornar observable nulo en caso de error
            })
          )
        );
        return forkJoin(historiasClinicasObservables);
      })
    )
    .subscribe(
      historiales => {
        if (!historiales || historiales.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Sin historias clínicas',
            text: 'Se encontraron turnos, pero no hay historias clínicas registradas para ellos.',
          });
          return;
        }

        let pdfGenerado = false;

        // Generar un PDF por cada historia clínica obtenida
        historiales.forEach(historiaClinicaArray => {
          historiaClinicaArray?.forEach(historiaClinica => {
            if (historiaClinica && this.pacienteEnTurno && this.medicoSeleccionado) {
              this.pdfService.generatePdf(this.pacienteEnTurno, this.medicoSeleccionado, historiaClinica);
              console.log('PDF generado para la historia clínica:', historiaClinica);
              pdfGenerado = true;
            }
          });
        });

        if (pdfGenerado) {
          Swal.fire({
            icon: 'success',
            title: 'PDF generado',
            text: 'Se ha generado el PDF correctamente.',
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'No se generaron PDFs',
            text: 'No se encontraron historias clínicas para generar PDFs.',
          });
        }
      },
      error => {
        console.error('Error en el proceso de generación de PDFs:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error en la generación de PDFs',
          text: 'Ocurrió un problema al generar los PDFs. Inténtalo nuevamente.',
        });
      }
    );
}

}
