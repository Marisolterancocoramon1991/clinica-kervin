import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-admin',
  standalone: true,
  imports: [],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.css'
})
export class MenuAdminComponent {

  constructor(private router: Router) {}

  navigatewelcome() {
    this.router.navigate(['/bienvenida']);
  }

  solicitudTurnoAdmin()
  {
    this.router.navigate(['administrador/solicitud']);
    
  }
  

  navigateTDoctor() {
    this.router.navigate(['registrar/admin/especialistaAdmin']);
  }
  showMessageOne() {
    Swal.fire({
      title: 'Breve Historia de Clínica Virtual',
      html: `
        <p>Clínica Virtual fue fundada en 1991 con el objetivo de proporcionar acceso a servicios de salud de calidad desde cualquier lugar. Desde nuestros inicios, hemos estado comprometidos con la excelencia en la atención médica y la innovación en telemedicina.</p>
        <p>Nuestra clínica ha crecido para convertirse en un líder reconocido en el campo de la telemedicina, sirviendo a miles de pacientes con cuidado compasivo y efectivo a lo largo de los años.</p>
        <p>Continuamos expandiendo nuestros servicios y adoptando tecnologías avanzadas para mejorar la experiencia de nuestros pacientes y mantener nuestro compromiso con la salud integral y accesible.</p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  showMessageTwo() {
    Swal.fire({
      title: 'Misión y Visión de Clínica Virtual',
      html: `
        <p><strong>Misión:</strong> Mejorar el bienestar de nuestros pacientes mediante una atención médica integral, personalizada y compasiva, utilizando tecnologías innovadoras y promoviendo la salud accesible.</p>
        <p><strong>Visión:</strong> Ser reconocidos como el proveedor líder de servicios de salud digital, proporcionando soluciones innovadoras y de alta calidad que mejoren la vida de las personas en todo el mundo.</p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  showMessageThree() {
    Swal.fire({
      title: 'Consejos para Seleccionar Especialistas',
      html: `
        <p>A la hora de seleccionar especialistas para su clínica, considere los siguientes consejos:</p>
        <ul>
          <li><strong>Entrevistas Estructuradas:</strong> Realice entrevistas estructuradas que evalúen no solo las habilidades técnicas, sino también las habilidades interpersonales y de comunicación del especialista.</li>
          <li><strong>Evaluación de Experiencia:</strong> Verifique la experiencia del especialista en el campo relevante y asegúrese de que esté actualizado con las últimas prácticas y tecnologías.</li>
          <li><strong>Referencias:</strong> Solicite referencias y testimonios de pacientes anteriores para evaluar la calidad del servicio y la satisfacción del paciente.</li>
          <li><strong>Evaluación Continua:</strong> Implemente un proceso de evaluación continua para garantizar que los especialistas cumplan con los estándares de calidad y satisfacción del paciente.</li>
        </ul>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  
  }
}

