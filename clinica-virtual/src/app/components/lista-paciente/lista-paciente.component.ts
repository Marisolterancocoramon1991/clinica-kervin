import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Paciente } from '../../bibliotecas/paciente.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-paciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-paciente.component.html',
  styleUrl: './lista-paciente.component.css'
})
export class ListaPacienteComponent implements OnInit{
  pacientes: Paciente[] = [];
  @Output() pacienteSeleccionado = new EventEmitter<Paciente>();
  pacienteActualSeleccionado: Paciente | null = null;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.authService.obtenerPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        console.log('Lista de pacientes:', this.pacientes);

        // Cargar las imágenes de perfil para cada paciente
        this.pacientes.forEach(paciente => {
          if (paciente.mail) {
            this.authService.getUserProfile1Url(paciente.uid).subscribe(
              imageUrl => {
                if (imageUrl !== null) {
                  paciente.profileImage = imageUrl;
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
      },
      error: (error) => {
        console.error('Error al obtener pacientes:', error);
      }
    });
  }
  seleccionarPaciente(paciente: Paciente): void {
    console.log('Paciente seleccionado:', paciente);
    this.pacienteActualSeleccionado = paciente;
    this.pacienteSeleccionado.emit(paciente);
  }

}
