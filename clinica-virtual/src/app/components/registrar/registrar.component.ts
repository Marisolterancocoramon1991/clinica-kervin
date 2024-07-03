import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export class RegistrarComponent {

  constructor(private router: Router) { }
  goRegisterDoctor() {
    this.router.navigateByUrl('registrar/medico');
  }

  goRegisterPatient() {
    this.router.navigateByUrl('registrar/paciente');
  }

  goRegisterAdmin() {
    this.router.navigateByUrl('registrar/admin');
  }
}
