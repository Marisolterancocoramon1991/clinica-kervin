import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs';
import {  User } from '@angular/fire/auth';
import { Medico } from '../../bibliotecas/medico.interface';
import { CommonModule } from '@angular/common';
import {Horario} from '../../bibliotecas/horarioEspecialista.interface'
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
  currentUser: User | null = null;
  medicoEnTurno: Medico | null = null; 
  userProfile1ImageUrl: string | null = null;
  numeroHorarios: number = 0;
  horarios: Horario[] = [];
  horariosEspecialistasCargadosEnFireBase: Horario[] = [];
  mostrarHorarios: boolean = false;

  constructor(private authService: AuthService){}
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
                  console.log('Datos del médico obtenidos:', this.medicoEnTurno);

                  // Obtener la URL de la imagen de perfil del médico si está disponible
                  if (this.currentUser && this.currentUser.uid) {
                    this.authService.getUserProfile1Ur2(this.currentUser.uid).subscribe(
                      imageUrl => {
                        this.userProfile1ImageUrl = imageUrl;
                        console.log('URL de imagen de perfil 1:', this.userProfile1ImageUrl);
                      },
                      error => {
                        console.error('Error obteniendo URL de imagen perfil1:', error);
                      }
                    );
                  }
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
  onNumeroHorariosChange() {
    this.horarios = Array(this.numeroHorarios).fill(0).map(() => ({
      dia: '',
      horaInicio: '',
      horaFin: '',
      correoEspecialista: this.currentUser?.email || '',
      disponibilidad: 'abierta' // Puedes establecer un valor predeterminado si es necesario
    }));
  }  
  saveSchedules() {
    const currentDate = new Date();
    if (!this.currentUser?.email) {
      console.error('No se pudo obtener el correo del usuario actual.');
      return;
    }
  
    // Cargar los horarios del especialista actual
    this.cargarHorariosEspecialista(this.currentUser?.email);
  
    this.horarios.forEach(horario => {
      const horaInicio = this.parseTimeStringToDate(horario.horaInicio);
      const horaFin = this.parseTimeStringToDate(horario.horaFin);
  
      // Validar que la diferencia sea al menos 30 minutos (30 * 60 * 1000 milisegundos)
      if (horaInicio.getTime() >= horaFin.getTime() - (30 * 60 * 1000)) {
        console.error('El horario de inicio debe ser al menos 30 minutos antes que el horario de fin:', horario);
        Swal.fire({
          title: 'Error al guardar horario',
          text: 'El horario de inicio debe ser al menos 30 minutos antes que el horario de fin.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return; // Salir de la iteración actual si la validación no se cumple
      }
  
      // Validar que la fecha del horario sea al menos un día después del día actual
      const dia = new Date(horario.dia);
      dia.setHours(0, 0, 0, 0); // Ajustar a medianoche para comparar solo la fecha
  
      if (dia.getTime() <= currentDate.getTime()) {
        console.error('El día del horario debe ser al menos un día después del día actual:', horario);
        Swal.fire({
          title: 'Error al guardar horario',
          text: 'El día del horario debe ser al menos un día después del día actual.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return; // Salir de la iteración actual si la validación no se cumple
      }
  
      // Validar que no haya conflictos con los horarios ya cargados
      const conflicto = this.horariosEspecialistasCargadosEnFireBase.some(horarioCargado =>
        this.horariosOverlap(horarioCargado, horario)
      );
  
      if (conflicto) {
        console.error('El horario entra en conflicto con un horario ya cargado:', horario);
        Swal.fire({
          title: 'Error al guardar horario',
          text: 'El horario entra en conflicto con uno ya cargado. Por favor, revise sus horarios.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return; // Salir de la iteración actual si hay conflicto
      }
  
      // Si pasa todas las validaciones, guardar el horario
      this.authService.saveHorario(horario).subscribe(
        () => {
          console.log('Horario guardado exitosamente:', horario);
          Swal.fire({
            title: 'Horario guardado',
            text: 'El horario ha sido guardado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        },
        error => {
          console.error('Error inesperado al guardar el horario:', error);
          Swal.fire({
            title: 'Error al guardar horario',
            text: 'Ocurrió un error inesperado al guardar el horario. Por favor, inténtelo nuevamente más tarde.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    });
  }
  
  // Función para verificar si dos horarios se solapan
  horariosOverlap(horario1: Horario, horario2: Horario): boolean {
    const inicio1 = this.parseTimeStringToDate(horario1.horaInicio);
    const fin1 = this.parseTimeStringToDate(horario1.horaFin);
    const inicio2 = this.parseTimeStringToDate(horario2.horaInicio);
    const fin2 = this.parseTimeStringToDate(horario2.horaFin);
  
    // Verificar si hay solapamiento de horarios
    return !(fin1 <= inicio2 || fin2 <= inicio1);
  }
  
  // Función para convertir la cadena de tiempo (HH:mm) en objeto Date
  private parseTimeStringToDate(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(part => parseInt(part, 10));
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  }

  listarHorarios(): void {
    if (this.currentUser?.email) {
      this.authService.getHorariosEspecialista(this.currentUser.email).subscribe(
        horarios => {
          console.log('Horarios del especialista:', horarios);
          this.horariosEspecialistasCargadosEnFireBase = horarios; // Mantener horaInicio y horaFin como strings
          this.mostrarHorarios = true;
        },
        error => {
          console.error('Error obteniendo horarios:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener los horarios. Por favor, inténtelo nuevamente más tarde.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }
  }

  cargarHorariosEspecialista(correoEspecialista: string): void {
    this.authService.getHorariosEspecialista(correoEspecialista).subscribe(
      horarios => {
        console.log('Horarios del especialista:', horarios);
        this.horariosEspecialistasCargadosEnFireBase = horarios; // Guardar horarios en la propiedad del componente
      },
      error => {
        console.error('Error obteniendo horarios:', error);
      }
    );
  }
  mostrarMensaje(event: MouseEvent): void {
    const mensaje = '¿Deseas cambiar el estado del horario?';
    const tooltip = document.createElement('div');
    tooltip.textContent = mensaje;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '3px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '1000';
    tooltip.style.top = `${event.clientY + 15}px`;
    tooltip.style.left = `${event.clientX + 15}px`;
    document.body.appendChild(tooltip);

    const removeTooltip = () => {
      document.body.removeChild(tooltip);
    };

    event.target?.addEventListener('mouseout', removeTooltip, { once: true });
  }
  cambiarEstadoHorario(index: number): void {
    if (index >= 0 && index < this.horariosEspecialistasCargadosEnFireBase.length) {
      this.horariosEspecialistasCargadosEnFireBase[index].disponibilidad = 'cancelada';
      this.authService.updateHorarioCancelada(this.horariosEspecialistasCargadosEnFireBase[index]).subscribe(
        () => {
          console.log('Horario actualizado exitosamente:', this.horariosEspecialistasCargadosEnFireBase[index]);
          Swal.fire({
            title: 'Horario actualizado',
            text: 'El estado del horario ha sido cambiado a cancelado.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        },
        error => {
          console.error('Error al actualizar el horario:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar el horario. Por favor, inténtelo nuevamente más tarde.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }
  }

}
