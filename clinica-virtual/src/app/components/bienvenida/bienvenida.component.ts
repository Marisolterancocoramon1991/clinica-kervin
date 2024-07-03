
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [
  ],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css'
})
export class BienvenidaComponent {


  constructor(private router: Router) { }

  mensaje() {
    Swal.fire({
      title: '¡Bienvenido a Clínica Virtual!',
      html: `
        <p>Bienvenido a <strong>Clínica Virtual</strong>, su socio de confianza en el cuidado de la salud desde 1991.</p>
        <p>En Clínica Virtual, priorizamos la atención médica eficiente y accesible. Nuestro equipo de profesionales experimentados se dedica a brindar servicios de salud de la más alta calidad desde la comodidad de su hogar.</p>
        <p>Con más de 30 años de experiencia, hemos construido una reputación de excelencia y compasión. Nuestras instalaciones de vanguardia y tecnologías avanzadas de telemedicina aseguran que reciba la mejor atención posible, sin importar dónde se encuentre.</p>
        <p>Nuestra misión es mejorar el bienestar de nuestros pacientes a través de una atención integral, personalizada y compasiva. Creemos en el poder de la innovación y la mejora continua para satisfacer las necesidades cambiantes de nuestra comunidad.</p>
        <p>Gracias por elegir Clínica Virtual. Esperamos poder servirle y ayudarle a alcanzar sus objetivos de salud.</p>
      `,
      icon: 'info',
      confirmButtonText: 'Comenzar'
    });

    
  }
  navigateToLogin() {
    this.router.navigateByUrl('/login');
  }

  navigateToRegister() {
    this.router.navigateByUrl('/registrar');
  }

}
