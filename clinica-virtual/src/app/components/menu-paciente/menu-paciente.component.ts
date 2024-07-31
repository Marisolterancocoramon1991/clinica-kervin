import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CabeceraComponent } from '../cabecera/cabecera.component';
  

@Component({
  selector: 'app-menu-paciente',
  standalone: true,
  imports: [
    CabeceraComponent,

  ],
  templateUrl: './menu-paciente.component.html',
  styleUrl: './menu-paciente.component.css'
})
export class MenuPacienteComponent {

  constructor(private router: Router) {}
  navigateSolicitud() {
    this.router.navigate(['paciente/formulario']);
  }
  navigateAdministracionTurno()
  {
    this.router.navigate(['paciente/formulario/administracion']);
  }

}
