import { Component, OnInit } from '@angular/core';
import {  User } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { Medico } from '../../bibliotecas/medico.interface';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ListaPacienteComponent } from '../lista-paciente/lista-paciente.component';
import { Paciente } from '../../bibliotecas/paciente.interface';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Turno } from '../../bibliotecas/turno.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HistoriaClinica } from '../../bibliotecas/historiaClinica.interface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paciente-especialista-sprint3',
  standalone: true,
  imports: [
    CabeceraComponent,
    ListaPacienteComponent,
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,

  ],
  templateUrl: './paciente-especialista-sprint3.component.html',
  styleUrl: './paciente-especialista-sprint3.component.css'
})
export class PacienteEspecialistaSprint3Component implements OnInit{
  currentUser: User | null = null;
  medicoEnTurno: Medico | null = null; 
  pacientes: Paciente[] = [];
  correoEspecialista: string = "";
  UIDPaciente: string[] = [];
  turnosRealizadosPacientes: Turno[] = [];
  historiaClinicaForm: FormGroup;
  turnoSeleccionado: Turno| null = null; 
  pacienteSeleccionado: Paciente| null = null;

  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder){
    this.historiaClinicaForm = this.fb.group({
      altura: [''],
      peso: [''],
      temperatura: [''],
      presion: ['', Validators.required],
      datosDinamicos: this.fb.array([]) // Aquí se inicializa el campo de datos dinámicos
    });
  }
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
                  this.authService.getIdPacientesTurnosRealizados(this.correoEspecialista).subscribe({
                    next: (idPacientes) => {
                      // Asignar los IDs de pacientes a la variable UIDPaciente
                      this.UIDPaciente = idPacientes;
              
                      // Crear un array de observables para obtener la información de cada paciente
                      const pacienteRequests = this.UIDPaciente.map(uid => 
                        this.authService.GetPacientePorUID(uid)
                      );
              
                      // Ejecutar todas las solicitudes y esperar a que todas se completen
                      forkJoin(pacienteRequests).subscribe({
                        next: (pacientes) => {
                          // Filtrar los pacientes nulos y asignar los datos a la variable pacientes
                          this.pacientes = pacientes.filter(paciente => paciente !== null) as Paciente[];
                          this.pacientes = pacientes
  .filter((paciente): paciente is Paciente => paciente !== null) // Filtrar valores null con type guard
  .filter((paciente, index, self) =>
    index === self.findIndex(p => p !== null && p.uid === paciente.uid) // Filtrar duplicados por uid
  );

              
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
    console.log('Paciente seleccionado:', paciente);
    this.pacienteSeleccionado = paciente;
     
    // Llamar a la función para obtener los turnos realizados por el paciente
    this.authService.getTurnosPorPacienteId(paciente.uid).subscribe({
      next: (turnos) => {
        // Asignar los turnos obtenidos al array `turnosRealizadosPacientes`
        this.turnosRealizadosPacientes = turnos;
        console.log('Turnos realizados para el paciente:', this.turnosRealizadosPacientes);
      },
      error: (error) => {
        console.error('Error al obtener turnos realizados:', error);
      }
    });
  }
   get datosDinamicos() {
    return this.historiaClinicaForm.get('datosDinamicos') as FormArray;
  }

  addDatosDinamicos() {
    const datoGroup = this.fb.group({
      clave: ['', Validators.required],
      valor: ['', Validators.required]
    });
    this.datosDinamicos.push(datoGroup);
  }

  removeDatosDinamicos(index: number) {
    this.datosDinamicos.removeAt(index);
  }

  onSubmit() {
    if (this.historiaClinicaForm.valid) {
      console.log(this.historiaClinicaForm.value);
      // Aquí iría la lógica para manejar el envío del formulario
    }
  }
  guardarHistoriaClinica() {
    if (!this.turnoSeleccionado) {
      // Mostrar alerta de turno no seleccionado
      Swal.fire({
        icon: 'warning',
        title: 'Turno no seleccionado',
        text: 'Por favor, seleccione un turno antes de guardar la historia clínica.',
        showConfirmButton: true
      });
      return;
    }
   console.log("entrar 1");
    if (this.historiaClinicaForm.valid && this.pacienteSeleccionado && this.medicoEnTurno) {
      const formData = this.historiaClinicaForm.value;
      console.log("entrar 2");
  
      const historiaClinica: HistoriaClinica = {
        id: '', // Este será el ID generado automáticamente
        idPaciente: this.pacienteSeleccionado.uid,
        mailEspecialista: this.medicoEnTurno.mail,
        idTurno: this.turnoSeleccionado.id, // Asigna el ID del turno seleccionado
        altura: formData.altura,
        peso: formData.peso,
        temperatura: formData.temperatura,
        presion: formData.presion,
        datosDinamicos: formData.datosDinamicos.reduce((acc: { [clave: string]: any }, dato: any) => {
          acc[dato.clave] = dato.valor;
          return acc;
        }, {})
      };
  
      this.authService.saveHistoriaClinica(historiaClinica).subscribe(
        (response) => {
          console.log('Historia Clínica guardada con éxito', response);
          this.router.navigate(['medico/menu']);
          // Mostrar alerta de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La historia clínica se ha guardado con éxito.',
            showConfirmButton: true
          });
        },
        (error) => {
          console.error('Error al guardar Historia Clínica', error);
          // Mostrar alerta de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la historia clínica. Por favor, inténtelo de nuevo.',
            showConfirmButton: true
          });
        }
      );
    } else {
      console.log('El formulario no es válido. Por favor, complete todos los campos requeridos.');
      // Mostrar alerta de formulario no válido
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, complete todos los campos requeridos antes de guardar.',
        showConfirmButton: true
      });
    }
  }
  seleccionarTurno(turno: Turno): void {
    this.turnoSeleccionado = turno;
  }
}
