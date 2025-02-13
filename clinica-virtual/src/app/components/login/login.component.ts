import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  completeFieldsAdministrator()
  { 
    this.email ="marta@gmail.com";
    this.password="123456";
  }

  completeFieldsDoctor1()
  {
    this.email ="kervinstilver1991@gmail.com";
    this.password="123456";
  }

  completeFieldsDoctorDos()
  {
    this.email ="martasjsj@gmail.com";
    this.password="123456";
  }

  completeFieldsDoctor()
  {
    this.email ="k_e_iver@hotmail.com";
    this.password="123456";
  }

  completeFieldsDoctor5(){
    this.email ="vicentebriceno1212@gmail.com";
    this.password="123456";
  }
  
  completeFieldsPatientDOS()
  {
    this.email = "keiver.pasket@gmail.com";
    this.password="123456";
  }

  completeFieldsPatientTres()
  {
    this.email= "marisolteran123@gmail.com";
    this.password="123456";
  }



  gotoWelcome()
  {
    this.router.navigateByUrl('**')
  }


  goToPag() {
    this.authService.login(this.email, this.password).then(() => {
      this.authService.getCurrentUser().subscribe(
        (user: User | null) => {
          if (user) {
            console.log('Usuario logueado:', user.email);
            // Obtener el rol del usuario autenticado
            this.authService.getUserRoleByUid(user.uid).subscribe(
              (rol: string | null) => {
                if (rol) {
                  console.log(rol);
                  switch (rol) {  
                    case 'paciente':
                      this.router.navigate(['menu/paciente']);
                      break;
                    case 'medico':
                      this.router.navigate(['medico/menu']);
                      break;
                    case 'admin':
                      this.router.navigate(['registrar/admin/menu']);
                      break;
                    default:
                      console.log('Rol no reconocido:', rol);
                      // Redireccionar a una página por defecto o manejar otro caso según tu lógica
                      break;
                  }
                } else {
                  console.log('No se pudo obtener el rol del usuario');
                  // Manejar el caso donde no se pudo obtener el rol
                }
              },
              error => {
                console.error('Error obteniendo el rol del usuario:', error);
              }
            );
          } else {
            console.log('Ningún usuario logueado');
          }
        },
        error => {
          console.error('Error obteniendo el usuario actual:', error);
        }
      );
    }).catch(error => {
      console.error('Error en la autenticación:', error);
      // Mostrar mensaje de error al usuario si la autenticación falla
    });
  }

}
