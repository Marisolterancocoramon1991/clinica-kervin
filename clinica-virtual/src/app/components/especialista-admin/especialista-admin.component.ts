import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RegistrarAdminComponent } from '../registrar-admin/registrar-admin.component';
import { RegistrarMedicoComponent } from '../registrar-medico/registrar-medico.component';
import { RegistrarPacienteComponent } from '../registrar-paciente/registrar-paciente.component';
import { error } from 'console';
import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-especialista-admin',
  standalone: true,
  imports: [
    RegistrarAdminComponent,
    RegistrarMedicoComponent,
    RegistrarPacienteComponent,
    CommonModule
  ],
  templateUrl: './especialista-admin.component.html',
  styleUrl: './especialista-admin.component.css'
})
export class EspecialistaAdminComponent implements OnInit{
  users: any[] = [];
  medicos: any[] = [];
  showAdmin = false; // Declaración de variables para mostrar componentes
  showMedico = false;
  showPaciente = false;

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    try {
      this.users = await this.authService.getUsers();
      console.log('Usuarios obtenidos:', this.users);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
    }
  }

  async listSpecialist()
  {
     this.medicos = this.users.filter(user => user.rol === 'medico');
    console.log(this.medicos);
    return this.medicos;
  }
  showRegistrarAdmin() {
    this.showAdmin = true;
    this.showMedico = false;
    this.showPaciente = false;
  }

  showRegistrarMedico() {
    this.showAdmin = false;
    this.showMedico = true;
    this.showPaciente = false;
  }

  showRegistrarPaciente() {
    this.showAdmin = false;
    this.showMedico = false;
    this.showPaciente = true;
  }

  aceptarMedico(medico: any) {
    this.authService.updateUserAprobadaPorAdmin(medico.uid, true);
    Swal.fire({
      title: 'Nuevo trabajador aceptado',
      html: `
        <strong>Nombre:</strong> ${medico.nombre} ${medico.apellido}<br>
        <strong>Especialidades:</strong> ${medico.especialidades}<br>
        <strong>Email:</strong> ${medico.email}<br>
        <strong>DNI:</strong> ${medico.dni}<br>
        <strong>Edad:</strong> ${medico.edad}<br>
        <strong>Obra Social:</strong> ${medico.obraSocial}<br>
      `,
      icon: 'success',
      confirmButtonColor: '#28a745', // Color verde
      confirmButtonText: 'Aceptar'
    });
  }
}
