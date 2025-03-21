import { Component, OnInit, Input, OnChanges  } from '@angular/core';
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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


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
    MatButtonToggleModule,

  ],
  templateUrl: './paciente-especialista-sprint3.component.html',
  styleUrl: './paciente-especialista-sprint3.component.css'
})
export class PacienteEspecialistaSprint3Component implements OnInit {
  medicoEnTurno: Medico | null = null; 
  correoEspecialista: string | null= "";
  
  historiaClinicaForm: FormGroup;
  turnoSeleccionado: Turno| null = null; 
  pacienteSeleccionado: Paciente| null = null;
  @Input() paciente: Paciente | null = null;
  @Input() medicoLogueado: Medico | null = null;
  @Input() especialidad: string = "";
  @Input() turnos: Turno | null = null;

  constructor(private sanitizer: DomSanitizer, private router: Router, private authService: AuthService, private fb: FormBuilder){
    this.historiaClinicaForm = this.fb.group({
      altura: ['', Validators.required],
      peso: ['', Validators.required],
      temperatura: ['', Validators.required],
      presion: ['', Validators.required],
      datosDinamicos: this.fb.array([]), // Para datos adicionales opcionales
    
      // Grupos fijos para datos dinámicos
      rangoDin: this.fb.group({
        clave: ['', Validators.required],
        valor: [50, Validators.required] // Valor predeterminado para el range
      }),
      textoNumericoDin: this.fb.group({
        clave: ['', Validators.required],
        valor: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
      }),
      switchDin: this.fb.group({
        clave: ['', Validators.required],
        valor: ['', Validators.required]  // Se espera que este control reciba "Si" o "No"
      })
    });    
  } 
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  ngOnInit(): void {
    if(this.paciente)
    this.pacienteSeleccionado = this.paciente;
    if(this.medicoLogueado)
    this.correoEspecialista = this.medicoLogueado?.mail
    this.turnoSeleccionado = this.turnos
    this.medicoEnTurno = this.medicoLogueado;
    
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
    console.log('Nuevo dato dinámico agregado. Total:', this.datosDinamicos.length);
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
      Swal.fire({
        icon: 'warning',
        title: 'Turno no seleccionado',
        text: 'Por favor, seleccione un turno antes de guardar la historia clínica.',
        showConfirmButton: true
      });
      return;
    }
  
    console.log("Iniciando guardado de historia clínica");
    if(this.pacienteSeleccionado)
      console.log("este paciente")

    if(this.medicoEnTurno)
      console.log("este medico");
  
    if (this.historiaClinicaForm.valid && this.pacienteSeleccionado && this.medicoEnTurno) {
      const formData = this.historiaClinicaForm.value;
      console.log("Valores del formulario:", formData);
  
      // Procesar datos del FormArray (datos adicionales opcionales)
      const datosDinamicosPrevios = (formData.datosDinamicos || []).reduce((acc: { [clave: string]: any }, dato: any) => {
        acc[dato.clave] = dato.valor;
        return acc;
      }, {});
      console.log("Datos del FormArray (datosDinamicos):", datosDinamicosPrevios);
  
      // Procesar los datos fijos de los grupos
      const fixedDynamicData: { [clave: string]: any } = {};
  
      if (formData.rangoDin && formData.rangoDin.clave) {
        fixedDynamicData[formData.rangoDin.clave] = formData.rangoDin.valor;
      }
      if (formData.textoNumericoDin && formData.textoNumericoDin.clave) {
        fixedDynamicData[formData.textoNumericoDin.clave] = formData.textoNumericoDin.valor;
      }
      if (formData.switchDin && formData.switchDin.clave) {
        fixedDynamicData[formData.switchDin.clave] = formData.switchDin.valor;
      }
      console.log("Datos de los grupos fijos:", fixedDynamicData);
  
      // Fusionar ambos objetos de datos dinámicos
      const datosDinamicosFinal = { ...datosDinamicosPrevios, ...fixedDynamicData };
      console.log("Objeto final de datosDinamicos:", datosDinamicosFinal);
      const historiaClinica: HistoriaClinica = {
        id: '', // Se asignará automáticamente en el backend
        idPaciente: this.pacienteSeleccionado.uid,
        mailEspecialista: this.medicoEnTurno.mail,
        idTurno: this.turnoSeleccionado.id,
        altura: formData.altura,
        peso: formData.peso,
        temperatura: formData.temperatura,
        presion: formData.presion,
        datosDinamicos: datosDinamicosFinal
      };
  
      console.log("Objeto historiaClinica a guardar:", historiaClinica);
  
      this.authService.saveHistoriaClinica(historiaClinica).subscribe(
        (response) => {
          console.log('Historia Clínica guardada con éxito', response);
          if(this.turnoSeleccionado)
          this.authService.updateTurnoHistoriaCargada(this.turnoSeleccionado).subscribe(
              (response) => {
                console.log("turno seleccionado ha cambiado de estado a cargado el historial");
              }
          );
        console.log(this.turnoSeleccionado?.id);
          //this.router.navigate(['medico/menu']);                           dddddddddddddddddddddddddddddddddddd
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La historia clínica se ha guardado con éxito.',
            showConfirmButton: true
          });
        },
        (error) => {
          console.error('Error al guardar Historia Clínica', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la historia clínica. Por favor, inténtelo de nuevo.',
            showConfirmButton: true
          });
        }
      );
    } else {
      console.log('Formulario inválido o datos faltantes.');
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, complete todos los campos requeridos antes de guardar.',
        showConfirmButton: true
      });
    }
  }
}
