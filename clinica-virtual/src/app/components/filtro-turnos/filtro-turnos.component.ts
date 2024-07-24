import { Component, EventEmitter, Output, ChangeDetectorRef, OnInit } from '@angular/core';
import { Specialty } from '../../bibliotecas/especialidad.enum';
import { CommonModule } from '@angular/common';
import { Medico } from '../../bibliotecas/medico.interface';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { subscribe } from 'diagnostics_channel';
import { user } from '@angular/fire/auth';
import { ImagenesEspecialidadService } from '../../services/imagenes-especialidad.service';
@Component({
  selector: 'app-filtro-turnos',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  templateUrl: './filtro-turnos.component.html',
  styleUrl: './filtro-turnos.component.css'
})
export class FiltroTurnosComponent implements OnInit{
  @Output() specialtySelected = new EventEmitter<Specialty>();
  @Output() medicosEncontradosChanged = new EventEmitter<Medico[]>();
  @Output() medicoSeleccionado = new EventEmitter<Medico>(); // Nuevo EventEmitter
  @Output() especialidadSeleccionada = new EventEmitter<string[]>();
  specialties: Specialty[] = Object.values(Specialty);
  mostrarEspecialidades = false; 

  especialidadesSeleccionadas: string[] = [];
  imagenesEspecialidades: { [especialidad: string]: string[] } = {};
  especialidades: string[] = [];
  mostrarMedicos= true;

  listaMedicos: Medico[] = [];
  selectedSpecialty: Specialty | undefined;
  isOpen = false;
  nombreEspecialista: string = '';
  medicosEncontrados: Medico[] = [];//es este 
  constructor(private cdr: ChangeDetectorRef, private authService: AuthService,
    private ImagenesEspecialidadService: ImagenesEspecialidadService
  ) {} 
  ngOnInit(): void {
    this.authService.getAllMedicos().subscribe(
      medicos => {
        if (medicos) {
          this.listaMedicos = medicos;
  
          medicos.forEach(medico => {
            if (medico.mail) {
              this.authService.getUserProfile1Ur2(medico.uid).subscribe(
                imageUrl => {
                  if (imageUrl !== null) {
                    medico.profileImage = imageUrl;
                    this.cdr.detectChanges(); // Actualiza la vista después de asignar la imagen
                  } else {
                    console.error('La URL de imagen de perfil es nula.');
                  }
                },
                error => {
                  console.error('Error al obtener URL de imagen de perfil:', error);
                }
              );
            }
          });
        }
      },
      error => {
        console.error('Error al obtener todos los médicos:', error);
      }
    );
  }

  
  
  

  selectSpecialty(specialty: Specialty): void {
    this.selectedSpecialty = specialty;
    console.log(specialty);
    this.specialtySelected.emit(specialty);
    this.authService.getMedicosByEspecialidad(specialty).subscribe(
      (medicos: Medico[]) => {
        this.medicosEncontrados = medicos;
        this.medicosEncontradosChanged.emit(medicos);
        this.cdr.detectChanges(); // Actualiza la vista después de asignar los datos
      },
      error => {
        console.error('Error al obtener médicos por especialidad:', error);
      }
    );
  }
  toggleDropdown(): void {
    console.log(this.isOpen);
    this.isOpen = !this.isOpen; // Alterna el estado del dropdown
    console.log(this.isOpen);
    this.cdr.detectChanges(); 
  }
  buscarMedicosPorNombre() {
    if (this.nombreEspecialista.trim() !== '') {
      this.authService.getMedicosByNombre(this.nombreEspecialista)
        .subscribe(
          (medicos: Medico[]) => {
            console.log('Médicos encontrados:', medicos);
            this.medicosEncontrados = medicos;
            this.medicosEncontradosChanged.emit(medicos);
          },
          error => {
            console.error('Error buscando médicos:', error);
            this.medicosEncontrados = []; // Limpiar la lista en caso de error
          }
        );
    } else {
      this.medicosEncontrados = []; // Limpiar la lista si no hay nombre especificado
    }
  }
  seleccionarMedico(medico: Medico) {
    this.medicoSeleccionado.emit(medico);
    this.imagenesEspecialidades = {};

    // Iterar sobre cada especialidad del médico y buscar imágenes
    medico.especialidades.forEach(especialidad => {
      this.ImagenesEspecialidadService.searchImages(especialidad).subscribe(
        (urls: string[]) => {
          // Guardar las URLs en imagenesEspecialidades por especialidad
          this.imagenesEspecialidades[especialidad] = urls ;
          console.log(`Imágenes de ${especialidad}:`, urls);
          this.cdr.detectChanges();
        },
        (error) => {
          console.error(`Error al obtener imágenes de ${especialidad}:`, error);
        }
      );
    });
    this.mostrarPantallas();
    

    console.log('Médico seleccionado:', medico);
  }
  getEspecialidadesKeys(): string[] {
    return Object.keys(this.imagenesEspecialidades);
  }
  mostrarPantallas() {
    if (this.mostrarMedicos === false && this.mostrarEspecialidades === false) {
      this.mostrarMedicos = true;
      this.mostrarEspecialidades = false;
    } else if (this.mostrarMedicos === true && this.mostrarEspecialidades === false) {
      this.mostrarMedicos = false;
      this.mostrarEspecialidades = true;
    } else {
      this.mostrarMedicos = false;
      this.mostrarEspecialidades = false;
    }
  }
  onSelectEspecialidad(especialidad: any): void {
    this.especialidadSeleccionada.emit(especialidad);
  }
  
}
