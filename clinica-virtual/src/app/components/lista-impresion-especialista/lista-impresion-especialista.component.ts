import { Component } from '@angular/core';
import { Paciente } from '../../bibliotecas/paciente.interface';
import { AuthService } from '../../services/auth.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { CommonModule } from '@angular/common';
import { HistoriaClinica } from '../../bibliotecas/historiaClinica.interface';
import { PdfService } from '../../services/pdf.service';
import { jsPDF } from 'jspdf';
import { Observable, of } from 'rxjs';
import { Medico } from '../../bibliotecas/medico.interface';

@Component({
  selector: 'app-lista-impresion-especialista',
  standalone: true,
  imports: [
    CabeceraComponent,
    CommonModule,

  ],
  templateUrl: './lista-impresion-especialista.component.html',
  styleUrl: './lista-impresion-especialista.component.css'
})
export class ListaImpresionEspecialistaComponent {
  currentUser: any;
  medicoEnTurno: any;
  correoEspecialista: string | null = null;
  UIDPaciente: string[] = [];
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente | null = null;
  historiasClinicas: HistoriaClinica[] = [];

  constructor(private authService: AuthService, private pdfService: PdfService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      user => {
        if (user) {
          this.currentUser = user;
          console.log('Usuario actual:', this.currentUser);

          if (user.email) {
            this.authService.getMedicosByMail(user.email).subscribe(
              medico => {
                if (medico.length > 0) {
                  this.medicoEnTurno = medico[0]; // Si esperas un solo médico, toma el primero de la lista
                  this.correoEspecialista = this.medicoEnTurno.mail;
                  console.log('Correo del especialista:', this.correoEspecialista);
                  console.log('Datos del médico obtenidos:', this.medicoEnTurno);

                  // Ahora que tenemos el correo del especialista, obtenemos los IDs de pacientes
                  if(this.correoEspecialista)
                  this.authService.getTurnosRealizadosClientes(this.correoEspecialista).subscribe({
                    next: (turnos) => {
                      // Obtener un array con los IDs únicos de pacientes
                      const uniqueUIDs = [...new Set(turnos.map(turno => turno.idPaciente))];

                      // Asignar los IDs de pacientes a la variable UIDPaciente
                      this.UIDPaciente = uniqueUIDs;

                      // Crear un array de observables para obtener la información de cada paciente
                      const pacienteRequests = this.UIDPaciente.map(uid =>
                        this.authService.GetPacientePorUID(uid)
                      );

                      // Ejecutar todas las solicitudes y esperar a que todas se completen
                      forkJoin(pacienteRequests).subscribe({
                        next: (pacientes) => {
                          // Filtrar los pacientes nulos y asignar los datos a la variable pacientes
                          this.pacientes = pacientes.filter(paciente => paciente !== null) as Paciente[];

                          // Opcional: Puedes realizar otras acciones con los datos de los pacientes aquí
                          console.log('Datos de pacientes:', this.pacientes);
                        },
                        error: (error) => {
                          console.error('Error al obtener la información de pacientes:', error);
                        }
                      });
                    },
                    error: (error) => {
                      console.error('Error al obtener IDs de pacientes:', error);
                    }
                  });
                } else {
                  console.log('No se encontraron datos de médico para el email:', user.email);
                }
              },
              error => {
                console.error('Error al obtener datos del médico:', error);
              }
            );
          } else {
            console.log('El usuario actual no tiene un email asociado.');
          }
        } else {
          console.log('No hay usuario autenticado.');
        }
      },
      error => {
        console.error('Error al obtener usuario actual:', error);
      }
    );
  }

  seleccionarPaciente(paciente: Paciente): void {
    this.pacienteSeleccionado = paciente;
    console.log(this.pacienteSeleccionado.nombre);
    
  } 
  guardarHistoriaClinica(): void {
    console.log(this.pacienteSeleccionado?.apellido);
    if (this.pacienteSeleccionado) {
      const uidPaciente = this.pacienteSeleccionado.uid;

      this.authService.getHistoriaClinicaPorPaciente(uidPaciente).subscribe({
        next: (historias) => {
          this.historiasClinicas = historias;
          console.log('Historiales clínicos obtenidos:', this.historiasClinicas);
 
          if ( this.medicoEnTurno) {
            this.historiasClinicas.forEach(historia => {
              if(this.pacienteSeleccionado)
              this.pdfService.generatePdf(this.pacienteSeleccionado, this.medicoEnTurno, historia);
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Datos incompletos',
              text: 'No se han seleccionado todos los datos necesarios.',
            });
          }
        },
        error: (error) => {
          console.error('Error al obtener historial clínico:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el historial clínico.',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Paciente no seleccionado',
        text: 'Por favor, selecciona un paciente.',
      });
    }
  }
 
}
