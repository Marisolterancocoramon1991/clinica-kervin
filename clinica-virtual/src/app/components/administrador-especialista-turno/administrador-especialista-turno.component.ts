import { Component, ChangeDetectorRef, OnInit, Input} from '@angular/core';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { AuthService } from '../../services/auth.service';
import { Paciente } from '../../bibliotecas/paciente.interface';
import { Medico } from '../../bibliotecas/medico.interface';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ImagenesEspecialidadService } from '../../services/imagenes-especialidad.service';
import { CommonModule } from '@angular/common';
import { ListaPacienteComponent } from '../lista-paciente/lista-paciente.component';
import { Turno } from '../../bibliotecas/turno.interface';
import Swal from 'sweetalert2';
import { PacienteEspecialistaSprint3Component } from '../paciente-especialista-sprint3/paciente-especialista-sprint3.component';
import { HistoriaClinica } from '../../bibliotecas/historiaClinica.interface';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-administrador-especialista-turno',
  standalone: true,
  imports: [
    CabeceraComponent,
    CommonModule,
    ListaPacienteComponent,
    PacienteEspecialistaSprint3Component
 
  ],
  templateUrl: './administrador-especialista-turno.component.html',
  styleUrl: './administrador-especialista-turno.component.css'
})
export class AdministradorEspecialistaTurnoComponent implements OnInit {
  paciente: Paciente | null = null;
  imagenesEspecialidades: { [especialidad: string]: string[] } = {}; 
  mostrarEspecialidades: boolean = false;
  medicoLogueado: Medico | null = null;
  especialidades: string[] = [];
  especialidad: string ="";
  turnos: Turno[] = [];
  cargaHistorialClinica: boolean = false;
  turnoSeleccionado: Turno | null = null;
  historiasClinicas: HistoriaClinica | null = null;

  constructor(private authService: AuthService,
    private imagenesEspecialidadService: ImagenesEspecialidadService,
    private cdr: ChangeDetectorRef, private pdfService: PdfService
  ){}
  
  recibirPaciente(paciente: Paciente) {
    this.paciente = paciente;
    this.mostrarEspecialidades = true;
    console.log('Paciente recibido ad:', paciente);
     
  }
  ngOnInit(): void {
    this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user && user.email) {
          return this.authService.getUserDataByMail(user.email);
        } else {
          return new Observable<Medico | null>(observer => {
            observer.next(null);
            observer.complete();
          });
        }
      })
    ).subscribe(userData => {
      if (userData && this.isMedico(userData)) {
        this.medicoLogueado = userData;
        this.especialidades = this.medicoLogueado.especialidades || [];
        this.cargarEspecialidades();
      } else {
        console.log('No se encontraron datos del médico.');
      }
    });
    
  }

  isMedico(user: any): user is Medico {
    return 'especialidades' in user;
  }

  onSelectEspecialidad(especialidad: string): void {
    this.especialidad = especialidad;
    console.log('Especialidad seleccionada:', especialidad);
    this.obtenerTurnos();
    
  }

  
  
  
  cargarEspecialidades(): void {
    if (this.medicoLogueado?.especialidades) {
      this.imagenesEspecialidades = {}; // Inicializar el objeto de imágenes
      this.medicoLogueado.especialidades.forEach(especialidad => {
        this.imagenesEspecialidadService.searchImages(especialidad).subscribe(
          (urls: string[]) => {
            // Guardar las URLs en imagenesEspecialidades por especialidad
            this.imagenesEspecialidades[especialidad] = urls;
            console.log(`Imágenes de ${especialidad}:`, urls);
            this.cdr.detectChanges(); // Forzar la actualización de la vista
          },
          (error) => {
            console.error(`Error al obtener imágenes de ${especialidad}:`, error);
          }
        );
      });
    } else {
      console.log('No hay especialidades disponibles para cargar imágenes.');
    }
  }

  getEspecialidadesKeys(): string[] {
    const keys = Object.keys(this.imagenesEspecialidades);
    console.log('Especialidades disponibles:', keys);
    return keys;
  }
  
 

  obtenerTurnos(): void {
    if (this.medicoLogueado && this.paciente) {
      const mailEspecialista = this.medicoLogueado.mail || ''; // Ajusta esto según cómo obtienes el email
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
        // Actualizar el estado del turno
        this.authService.updateTurnoCancelado(turno).subscribe(
          () => {
            // Actualizar el estado del horario
            if(turno.idHorario)
            this.authService.updateHorarioCanceladoById(turno.idHorario).subscribe(
              () => {
                Swal.fire('Cancelado', 'El turno y el horario han sido cancelados.', 'success');
                this.obtenerTurnos(); // Actualiza la lista de turnos después de cancelar
              },
              (error) => {
                Swal.fire('Error', 'No se pudo cancelar el horario. Inténtalo de nuevo.', 'error');
                console.error('Error al cancelar el horario:', error);
              }
            );
          },
          (error) => {
            Swal.fire('Error', 'No se pudo cancelar el turno. Inténtalo de nuevo.', 'error');
            console.error('Error al cancelar el turno:', error);
          }
        );
      }
    });
  }
  
  // Función para rechazar el turno y actualizar el horario asociado
  rechazarTurno(turno: Turno): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres rechazar el turno con ${turno.nombreEspecialista}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'No, mantener'
    }).then((result) => {
      if (result.isConfirmed) {
        // Actualizar el estado del turno
        this.authService.updateTurnoRechazado(turno).subscribe(
          () => {
            // Actualizar el estado del horario
            if(turno.idHorario)
            this.authService.updateHorarioRechazadoById(turno.idHorario).subscribe(
              () => {
                Swal.fire('Rechazado', 'El turno y el horario han sido rechazados.', 'success');
                this.obtenerTurnos(); // Actualiza la lista de turnos después de rechazar
              },
              (error) => {
                Swal.fire('Error', 'No se pudo rechazar el horario. Inténtalo de nuevo.', 'error');
                console.error('Error al rechazar el horario:', error);
              }
            );
          },
          (error) => {
            Swal.fire('Error', 'No se pudo rechazar el turno. Inténtalo de nuevo.', 'error');
            console.error('Error al rechazar el turno:', error);
          }
        );
      }
    });
  }
  
  // Función para aceptar el turno y actualizar el horario asociado
  aceptarTurno(turno: Turno): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres aceptar el turno con ${turno.nombreEspecialista}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'No, mantener'
    }).then((result) => {
      if (result.isConfirmed) {
        // Actualizar el estado del turno
        this.authService.updateTurnoAceptado(turno).subscribe(
          () => {
            // Actualizar el estado del horario
            if(turno.idHorario)
            this.authService.updateHorarioAbiertoById(turno.idHorario).subscribe(
              () => {
                Swal.fire('Aceptado', 'El turno y el horario han sido aceptados.', 'success');
                this.obtenerTurnos(); // Actualiza la lista de turnos después de aceptar
              },
              (error) => {
                Swal.fire('Error', 'No se pudo aceptar el horario. Inténtalo de nuevo.', 'error');
                console.error('Error al aceptar el horario:', error);
              }
            );
          },
          (error) => {
            Swal.fire('Error', 'No se pudo aceptar el turno. Inténtalo de nuevo.', 'error');
            console.error('Error al aceptar el turno:', error);
          }
        );
      }
    });
  }

  finalizarTurno(turno: Turno): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres Finalizar el turno con ${turno.nombreEspecialista}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'No, mantener'
    }).then((result) => {
      if (result.isConfirmed) {
        // Actualizar el estado del turno
        this.authService.updateTurnoRealizado(turno).subscribe(
          () => {
            // Actualizar el estado del horario
            if(turno.idHorario)
            this.authService.updateHorarioRealizadoById(turno.idHorario).subscribe(
              () => {
                Swal.fire('Aceptado', 'El turno y el horario han sido aceptados.', 'success');
                this.obtenerTurnos(); // Actualiza la lista de turnos después de aceptar
              },
              (error) => {
                Swal.fire('Error', 'No se pudo aceptar el horario. Inténtalo de nuevo.', 'error');
                console.error('Error al aceptar el horario:', error);
              }
            );
          },
          (error) => {
            Swal.fire('Error', 'No se pudo aceptar el turno. Inténtalo de nuevo.', 'error');
            console.error('Error al aceptar el turno:', error);
          }
        );
      }
    });
  }
  cargarturno(turno: Turno){
    this.cargaHistorialClinica = !this.cargaHistorialClinica;
    this.turnoSeleccionado = turno;
  }
  
  guardarHistoriaClinica(turno: Turno){
    const idTurno = turno.id
    this.authService.getHistoriaClinicaPorIdTurno(idTurno)
        .subscribe(
          (historia) => {
            if (historia) {
              this.historiasClinicas = historia;
              if(this.paciente && this.medicoLogueado)
              this.pdfService.generatePdf(this.paciente, this.medicoLogueado, this.historiasClinicas);
              console.log('Historia clínica encontrada:', historia);
            } else {
              console.log('No se encontró historia clínica para el turno.');
            }
          },
          (error) => {
            console.error('Error al obtener la historia clínica:', error);
          }
        );
  }
}
 