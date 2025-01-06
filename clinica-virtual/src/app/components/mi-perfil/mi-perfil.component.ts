import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { Medico } from '../../bibliotecas/medico.interface';
import { CommonModule } from '@angular/common';
import { Horario } from '../../bibliotecas/horarioEspecialista.interface';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { formatDate as angularFormatDate } from '@angular/common';

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
  diasDisponibles: Date[] = [];
  horasDisponibles: string[] = [
    '09:00', '09:45',
    '10:00', '10:45',
    '11:00', '11:45',
    '12:00', '12:45',
    // Periodo de descanso de 1 a 2 de la tarde
    '14:00', '14:45',
    '15:00', '15:45',
    '16:00', '16:45',
    '17:00', '17:45',
  ];
  getParesDeHoras(): { inicio: string; fin: string }[] {
    const pares: { inicio: string; fin: string }[] = [];
    for (let i = 0; i < this.horasDisponibles.length - 1; i += 2) {
      pares.push({
        inicio: this.horasDisponibles[i],
        fin: this.horasDisponibles[i + 1],
      });
    }
    return pares;
  }
  constructor(private authService: AuthService) {}

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
                  this.medicoEnTurno = medico[0];
                  console.log('Datos del médico obtenidos:', this.medicoEnTurno);

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
    this.inicializarDiasDisponibles();
  }

  onNumeroHorariosChange() {
    this.horarios = Array(this.numeroHorarios).fill(0).map(() => ({
      dia: '',
      horaInicio: '',
      horaFin: '',
      correoEspecialista: this.currentUser?.email || '',
      disponibilidad: 'abierta'
    }));
  }  

  formatDate(date: Date): string {
    return angularFormatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  seleccionarTurno(horaInicio: string, horaFin: string | null) {
    if (!horaFin) {
      console.error('No se puede seleccionar un turno sin horario de fin');
      return;
    }

    if (this.horarios.length > 0) {
      const horario = this.horarios[0];
      horario.horaInicio = horaInicio;
      horario.horaFin = horaFin;
    }
  }

  saveSchedules() {
    const currentDate = new Date();
    if (!this.currentUser?.email) {
      console.error('No se pudo obtener el correo del usuario actual.');
      return;
    }
  
    // Cargar los horarios del especialista actual
    this.cargarHorariosEspecialista(this.currentUser.email);
  
    this.horarios.forEach(horario => {
      const horaInicio = this.parseTimeStringToDate(horario.horaInicio);
      const horaFin = this.parseTimeStringToDate(horario.horaFin);
  
      // Validar que la fecha esté cargada
      if (!horario.dia) {
        console.error('La fecha del horario no está cargada:', horario);
        Swal.fire({
          title: 'Error al guardar horario',
          text: 'Debe seleccionar una fecha para cada horario.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
  
      // Validar que la diferencia entre inicio y fin sea al menos de 15 minutos
      if (horaInicio.getTime() >= horaFin.getTime() - (15 * 60 * 1000)) {
        console.error('El horario de inicio debe ser al menos 15 minutos antes que el horario de fin:', horario);
        Swal.fire({
          title: 'Error al guardar horario',
          text: 'El horario de inicio debe ser al menos 15 minutos antes que el horario de fin.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
  
      // Validar que no exista el mismo horario ya cargado
      const duplicado = this.horariosEspecialistasCargadosEnFireBase.some(horarioCargado =>
        horarioCargado.dia === horario.dia &&
        horarioCargado.horaInicio === horario.horaInicio &&
        horarioCargado.horaFin === horario.horaFin
      );
  
      if (duplicado) {
        console.error('El horario ya está cargado:', horario);
        Swal.fire({
          title: 'Error al guardar horario',
          text: 'El horario ya existe. Por favor, seleccione otro.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
  
      // Validar conflictos con otros horarios ya cargados
      const conflicto = this.horariosEspecialistasCargadosEnFireBase.some(horarioCargado =>
        this.horariosOverlap(horarioCargado, horario) ||
        this.diferenciaMenor15Minutos(horarioCargado, horario)
      );
  
      if (conflicto) {
        console.error('El horario entra en conflicto con un horario ya cargado:', horario);
        Swal.fire({
          title: 'Error al guardar horario',
          text: 'El horario entra en conflicto con uno ya cargado. Por favor, revise sus horarios.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
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
          // Recargar horarios después de guardar
          this.listarHorarios();
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
  
  horariosOverlap(horario1: Horario, horario2: Horario): boolean {
    if (horario1.dia !== horario2.dia) {
      return false;
    }
    const inicio1 = this.parseTimeStringToDate(horario1.horaInicio);
    const fin1 = this.parseTimeStringToDate(horario1.horaFin);
    const inicio2 = this.parseTimeStringToDate(horario2.horaInicio);
    const fin2 = this.parseTimeStringToDate(horario2.horaFin);

    return !(fin1 <= inicio2 || fin2 <= inicio1);
  }

  diferenciaMenor15Minutos(horario1: Horario, horario2: Horario): boolean {
    const inicio1 = this.parseTimeStringToDate(horario1.horaInicio);
    const fin1 = this.parseTimeStringToDate(horario1.horaFin);
    const inicio2 = this.parseTimeStringToDate(horario2.horaInicio);
    const fin2 = this.parseTimeStringToDate(horario2.horaFin);

    return Math.abs(inicio1.getTime() - fin2.getTime()) < (15 * 60 * 1000) ||
           Math.abs(inicio2.getTime() - fin1.getTime()) < (15 * 60 * 1000);
  }

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
          this.horariosEspecialistasCargadosEnFireBase = horarios;
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
        this.horariosEspecialistasCargadosEnFireBase = horarios;
      },
      error => {
        console.error('Error obteniendo horarios:', error);
      }
    );
  }

  inicializarDiasDisponibles() {
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);

    const quinceDiasDespues = new Date();
    quinceDiasDespues.setDate(quinceDiasDespues.getDate() + 15);

    this.diasDisponibles = this.getFechasEntre(mañana, quinceDiasDespues);
  }

  getFechasEntre(fechaInicio: Date, fechaFin: Date): Date[] {
    const fechas: Date[] = [];
    let fechaActual = new Date(fechaInicio);

    while (fechaActual <= fechaFin) {
      fechas.push(new Date(fechaActual));
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return fechas;
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
