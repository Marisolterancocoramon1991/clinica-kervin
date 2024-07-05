import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { Specialty } from '../../bibliotecas/especialidad.enum';
import { CommonModule } from '@angular/common';
import { Medico } from '../../bibliotecas/medico.interface';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-turnos',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  templateUrl: './filtro-turnos.component.html',
  styleUrl: './filtro-turnos.component.css'
})
export class FiltroTurnosComponent {
  @Output() specialtySelected = new EventEmitter<Specialty>();
  @Output() medicosEncontradosChanged = new EventEmitter<Medico[]>();
  @Output() medicoSeleccionado = new EventEmitter<Medico>(); // Nuevo EventEmitter
  specialties: Specialty[] = Object.values(Specialty);
  selectedSpecialty: Specialty | undefined;
  isOpen = false;
  nombreEspecialista: string = '';
  medicosEncontrados: Medico[] = [];//es este 
  constructor(private cdr: ChangeDetectorRef, private authService: AuthService) {} 

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
    // Aquí puedes manejar la lógica para seleccionar al médico, por ejemplo, guardar su ID o mostrar algún mensaje de confirmación.
    console.log('Médico seleccionado:', medico);
  }
   

}
