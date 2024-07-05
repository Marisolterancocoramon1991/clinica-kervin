import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Turno } from '../../bibliotecas/turno.interface';
import { AuthService } from '../../services/auth.service';
import {  User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../bibliotecas/paciente.interface';
import { switchMap } from 'rxjs/operators';
import { FiltroTurnosComponent } from '../filtro-turnos/filtro-turnos.component';
import { CargaTurnoPacienteComponent } from '../carga-turno-paciente/carga-turno-paciente.component';
import { Medico } from '../../bibliotecas/medico.interface';

@Component({
  selector: 'app-mis-turnos-pacientes',
  standalone: true,
  imports: [CommonModule,
    CargaTurnoPacienteComponent,
    FiltroTurnosComponent

  ],
  templateUrl: './mis-turnos-pacientes.component.html',
  styleUrl: './mis-turnos-pacientes.component.css'
})
export class MisTurnosPacientesComponent implements OnInit{
  @Output() medicoSeleccionado = new EventEmitter<Medico>();
  @Input() medico: Medico | null = null; 
  turnos$: Observable<Turno[]> | undefined; 
  currentUser: User | null = null;
  userProfile1ImageUrl: string | null = null;
  pacienteEnTurno: Paciente | null = null; 
  showFiltro: boolean = false;
  showMisTurnos: boolean = false;
  medicosEncontrados: Medico[] = [];


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
        this.pacienteEnTurno = userData;
        console.log('Paciente en turno:', this.pacienteEnTurno);
      } else {
        console.log('No se encontraron datos de paciente.');
      }
  
      if (this.currentUser && this.currentUser.uid) {
        const uidPaciente = this.currentUser.uid;
        this.turnos$ = this.authService.getTurnosPaciente(uidPaciente);
        this.authService.getUserProfile1Url(this.currentUser.uid).subscribe(
          imageUrl => {
            this.userProfile1ImageUrl = imageUrl;
            console.log('URL de imagen de perfil 1:', this.userProfile1ImageUrl);
          },
          error => {
            console.error('Error obteniendo URL de imagen perfil1:', error);
          }
        );
      }
    });
  }

  showComponent() {
    this.showFiltro = !this.showFiltro;
    this.showMisTurnos = !this.showMisTurnos ;

  }

  // Método para recibir los médicos encontrados desde FiltroTurnosComponent
  recibirMedicosEncontrados(medicos: Medico[]) {
    this.medicosEncontrados = medicos;
    console.log('Médicos recibidos en MisTurnosPacientesComponent:', this.medicosEncontrados);
    // Aquí puedes realizar cualquier lógica adicional con los médicos encontrados
  }
  recibirMedicoSeleccionado(medico: Medico) {
    this.medicoSeleccionado.emit(medico);
    console.log('Médico seleccionado en MisTurnosPacientesComponent:', medico);
    // Aquí puedes manejar la lógica para el médico seleccionado
  }

  seleccionarMedico(medico: Medico) {
    this.medicoSeleccionado.emit(medico);
    alert("entro aqui dos");
  }
  
}
