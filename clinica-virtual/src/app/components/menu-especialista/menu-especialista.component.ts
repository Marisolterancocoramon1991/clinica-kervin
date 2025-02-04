import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { IdiomaService } from '../../services/idioma.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-especialista',
  standalone: true,
  imports: [
    CabeceraComponent, CommonModule
  ],
  templateUrl: './menu-especialista.component.html',
  styleUrl: './menu-especialista.component.css'
})
export class MenuEspecialistaComponent {
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
  navigateMiPerfil() {
    this.router.navigate(['/medico/miperfil']);
  }
  navigateAdministradorEspecial()
  {
    this.router.navigate(['/medico/menu/administracionturno']);
  }

  navigateAdministradorEspecialListaHistoriaclinica()
  {
    this.router.navigate(['/medico/listar/paciente/historialclinico']);
  }
  navigateAdministradorEspecialLlenarHistoria()
  {
    this.router.navigate(['/medico/llenarHistoriaClinica']);
  }
}
