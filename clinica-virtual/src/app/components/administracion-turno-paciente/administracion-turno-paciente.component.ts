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
