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
    this.email ="kervinstyle@gmail.com";
    this.password="123456";
  }

  completeFieldsPatient()
  {
    this.email ="kervinstilver1991@gmail.com";
    this.password="123456";
  }

  completeFieldsDoctor()
  {
    this.email ="martalatra@gmail.com";
    this.password="123456";
  }
  
  enterRoomAdministrator()
  {

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
                      this.router.navigate(['**']);
                      break;
                    case 'medico':
                      this.router.navigate(['/especialista']);
                      break;
                    case 'admin':
                      this.router.navigate(['/administrador']);
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
