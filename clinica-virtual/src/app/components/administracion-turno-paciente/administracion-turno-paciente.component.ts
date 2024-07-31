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

@Component({
  selector: 'app-administracion-turno-paciente',
  standalone: true,
  imports: [
    FiltroTurnosComponent,
    CommonModule,


  ],
  templateUrl: './administracion-turno-paciente.component.html',
  styleUrl: './administracion-turno-paciente.component.css'
})
export class AdministracionTurnoPacienteComponent implements OnInit{
  medicoSeleccionado: Medico | null = null;
  especialidad: string = '';
  mailEspecialista: string = '';
  nombreEspecialista: string = '';
  paciente: Paciente | null = null;
  turnos: Turno[] = [];
  currentUser: User | null = null;
  rating: number = 0;
  constructor(private authService: AuthService){}

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
        this.paciente = userData;
      } else {
        console.log('No se encontraron datos de paciente.');
      }
    });
  }


  recibirEspecialidadSeleccionada(especialidad: any): void {
    this.especialidad = especialidad;
    console.log('Especialidad seleccionada recibida:', especialidad);
    this.obtenerTurnos();
    // Aquí puedes agregar la lógica que necesites para manejar la especialidad seleccionada
  }
  

  recibirMedicoSeleccionado(medico: Medico) {
    this.medicoSeleccionado = medico;
    console.log('Médico seleccionado en solicitudAdministrador:', medico);
    this.mailEspecialista = this.medicoSeleccionado.mail;
    this.nombreEspecialista = `${this.medicoSeleccionado.nombre} ${this.medicoSeleccionado.apellido}`;
  }
  
  obtenerTurnos(): void {
    if (this.medicoSeleccionado && this.paciente) {
      const mailEspecialista = this.medicoSeleccionado.mail || ''; // Ajusta esto según cómo obtienes el email
      const especialidad = this.especialidad;
      const idPaciente = this.paciente.uid || ''; // Ajusta esto según cómo obtienes el idPaciente
      
      this.authService.getTurnosPorParametros(mailEspecialista, especialidad, idPaciente).subscribe(
        (turnos: Turno[]) => {
          this.turnos = turnos;
          console.log('Turnos obtenidos:', turnos);
        },
        (error) => {
          console.error('Error al obtener los turnos:', error);
        }
      );
    } else {
      console.log('No se puede obtener turnos, datos del médico o paciente no disponibles.');
    }
  }
  cancelarTurno(turno: Turno): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres cancelar el turno con ${turno.nombreEspecialista}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Comentario',
          text: 'Por favor, ingresa un comentario sobre la cancelación:',
          input: 'textarea',
          inputPlaceholder: 'Escribe tu comentario aquí...',
          showCancelButton: true,
          confirmButtonText: 'Enviar',
          cancelButtonText: 'Omitir'
        }).then((commentResult) => {
          if (commentResult.isConfirmed || commentResult.dismiss === Swal.DismissReason.cancel) {
            const comentario = commentResult.value || 'Sin comentario';
            const comentarioPaciente: ComentarioPaciente = {
              idComentario: "", // Generar un ID único
              idTurno: turno.id,
              comentario: comentario
            };
  
            this.authService.saveComentarioPaciente(comentarioPaciente).subscribe(
              () => {
                Swal.fire('Cancelado', 'El turno ha sido cancelado y tu comentario ha sido guardado.', 'success');
                this.obtenerTurnos(); // Actualiza la lista de turnos después de cancelar
              },
              (error) => {
                Swal.fire('Error', 'No se pudo cancelar el turno o guardar el comentario. Inténtalo de nuevo.', 'error');
                console.error('Error al cancelar el turno o guardar el comentario:', error);
              }
            );
          }
        });
      }
    });
  }
  

  chequeoComentarioEspecialista(turno: Turno): void {
    const comentario = turno.comentario;
    Swal.fire({
      title: 'Comentario del Especialista',
      text: comentario,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }
  dejarResenia(turno: Turno): void {
    Swal.fire({
      title: 'Dejar una reseña',
      input: 'textarea',
      inputLabel: 'Escribe tu comentario sobre el especialista',
      inputPlaceholder: 'Escribe tu comentario aquí...',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const comentarioPacienteDos: ComentarioPaciente = {
          idComentario: '', // Será generado por Firestore
          idTurno: turno.id,
          comentario: result.value
        };
        
        this.authService.saveComentarioPaciente(comentarioPacienteDos).subscribe(
          () => {
            Swal.fire('Enviado', 'Tu comentario ha sido enviado.', 'success');
            this.obtenerTurnos(); // Actualiza la lista de turnos después de enviar el comentario
          },
          (error) => {
            Swal.fire('Error', 'No se pudo enviar tu comentario. Inténtalo de nuevo.', 'error');
            console.error('Error al enviar el comentario:', error);
          }
        );
      }
    });
  }
  setRating(star: number, turno: Turno): void {
    this.rating = star;

    const calificacion: Calificacion = {
      id: "",
      idTurno: turno.id,
      calificacion: this.rating 
    };

    this.authService.saveCalificacion(calificacion).subscribe(
      () => {
        Swal.fire('Enviado', 'Tu calificación ha sido enviada.', 'success');
      },
      (error) => {
        Swal.fire('Error', 'No se pudo enviar tu calificación. Inténtalo de nuevo.', 'error');
        console.error('Error al enviar la calificación:', error);
      }
    );
  }
  
}