import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CabeceraComponent } from '../cabecera/cabecera.component';

@Component({
  selector: 'app-menu-especialista',
  standalone: true,
  imports: [
    CabeceraComponent
  ],
  templateUrl: './menu-especialista.component.html',
  styleUrl: './menu-especialista.component.css'
})
export class MenuEspecialistaComponent {
  constructor(private router: Router) {}
  navigateMiPerfil() {
    this.router.navigate(['/medico/miperfil']);
  }


}
