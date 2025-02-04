import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { IdiomaService } from '../../services/idioma.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
  

@Component({
  selector: 'app-menu-paciente',
  standalone: true,
  imports: [
    CabeceraComponent, CommonModule

  ],
  templateUrl: './menu-paciente.component.html',
  styleUrl: './menu-paciente.component.css'
})
export class MenuPacienteComponent {
  idioma: string = ''; // Idioma actual
  private subscription!: Subscription;
  constructor(private router: Router, private idiomaService: IdiomaService) {}
  ngOnInit() {
    // Suscribirse al servicio para cambios dinámicos
    this.subscription = this.idiomaService.idiomaActual$.subscribe((nuevoIdioma) => {
      this.idioma = nuevoIdioma; // Actualiza el idioma dinámicamente
      console.log('Idioma actualizado en MenuAdminComponent:', nuevoIdioma);
    });
  }
  navigateSolicitud() {
    this.router.navigate(['paciente/formulario']);
  }
  navigateAdministracionTurno()
  {
    this.router.navigate(['paciente/formulario/administracion']);
  }

  navigateImpresionTurno()
  {
    this.router.navigate(['paciente/impresion/busqueda/pdf']);
  }
}
