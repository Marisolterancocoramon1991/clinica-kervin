import { Component, OnInit} from '@angular/core';
import { ExcelService } from '../../services/excel.service';
import { Paciente } from '../../bibliotecas/paciente.interface';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import Swal from 'sweetalert2';
import { PdfService } from '../../services/pdf.service';
import { HistoriaClinica } from '../../bibliotecas/historiaClinica.interface';
import { Medico } from '../../bibliotecas/medico.interface';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs';

@Component({
  selector: 'app-seccion-usuarios-administrador',
  standalone: true,
  imports: [
    CommonModule,
    CabeceraComponent
  ],
  templateUrl: './seccion-usuarios-administrador.component.html',
  styleUrl: './seccion-usuarios-administrador.component.css'
})

export class SeccionUsuariosAdministradorComponent implements OnInit{
  pacientes: Paciente[] = [];
  pacientesConImagen: { paciente: Paciente, imagenUrl: string | null }[] = [];
  pacienteSeleccionado: Paciente | null = null;
  historiasClinicas: HistoriaClinica[] = [];
  medico: any;

  constructor(private excelService: ExcelService, private AuthService: AuthService,
    private pdfService: PdfService
  ) { }

  ngOnInit(): void {
    this.AuthService.obtenerPacientes().subscribe(pacientes => {
      this.pacientes = pacientes;
      pacientes.forEach(paciente => {
        this.AuthService.getUserProfile1Url(paciente.uid).subscribe(imagenUrl => {
          this.pacientesConImagen.push({ paciente, imagenUrl });
        });
      });
    });
  }


  exportToExcel(): void {
    this.excelService.createExcel(this.pacientes);
  }

  seleccionarPaciente(paciente: Paciente): void {
    this.pacienteSeleccionado = paciente;
    this.guardarHistoriaClinica();
    
  }

  guardarHistoriaClinica(): void {
    console.log(this.pacienteSeleccionado?.apellido);
    if (this.pacienteSeleccionado) {
      const uidPaciente = this.pacienteSeleccionado.uid;
  
      this.AuthService.getHistoriaClinicaPorPaciente(uidPaciente).subscribe({
        next: (historias) => {
          this.historiasClinicas = historias;
          console.log('Historiales clínicos obtenidos:', this.historiasClinicas);
  
          if (this.historiasClinicas.length > 0) {
            // Procesar cada historia clínica y obtener el médico correspondiente
            forkJoin(
              this.historiasClinicas.map(historia =>
                this.AuthService.getMedicosByMail(historia.mailEspecialista).pipe(
                  map(medicos => ({ historia, medico: medicos[0] })) // Asumiendo que el correo es único y solo retorna un médico
                )
              )
            ).subscribe({
              next: (result) => {
                result.forEach(({ historia, medico }) => {
                  if (medico && this.pacienteSeleccionado) {
                    this.pdfService.generatePdf(this.pacienteSeleccionado, medico, historia);
                  } else {
                    console.error(`No se encontró un médico con el correo: ${historia.mailEspecialista}`);
                  }
                });
              },
              error: (error) => {
                console.error('Error al obtener médicos:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo obtener la información del médico.',
                });
              }
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'No hay historias clínicas',
              text: 'No se encontraron historias clínicas para el paciente seleccionado.',
            });
          }
        },
        error: (error) => {
          console.error('Error al obtener historial clínico:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el historial clínico.',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Paciente no seleccionado',
        text: 'Por favor, selecciona un paciente.',
      });
    }
  }
 

}
