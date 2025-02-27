import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Medico } from '../../bibliotecas/medico.interface';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-m-perfiles-medicos',
  standalone: true,
  imports: [CommonModule, CapitalizePipe, TruncatePipe],
  templateUrl: './m-perfiles-medicos.component.html',
  styleUrls: ['./m-perfiles-medicos.component.css']
})
export class MPerfilesMedicosComponent {
  currentUser: User | null = null;
  medico: Medico | null = null; 
  userProfile1ImageUrl: string | null = null;
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().pipe(
      switchMap(user => {
        this.currentUser = user;
        if (user && user.email) {
          // Obtener los datos del usuario por mail
          return this.authService.getUserDataByMail(user.email);
        } else {
          return of(null);
        }
      })
    ).subscribe({
      next: userData => {
        console.log('Usuario actual:', this.currentUser);
        console.log('Datos obtenidos:', userData);
  
        // Verificamos que el usuario tenga UID
        if (this.currentUser && this.currentUser.uid) {
          this.authService.getUserRoleByUid(this.currentUser.uid).pipe(
            switchMap(rol => {
              console.log('Rol del usuario:', rol);
              if (rol === "medico") {
                // Verificamos que los datos obtenidos sean de tipo Medico usando isMedico
                if (!this.isMedico(userData)) {
                  console.error("Los datos obtenidos no corresponden a un médico.");
                  return of(null);
                }
                this.medico = userData;
                // Obtener la imagen de perfil para médicos (usamos getUserProfile1Ur2
                return this.authService.getUserProfile1Ur2(this.currentUser!.uid);
              } else {
                console.log("El usuario no es médico.");
                return of(null);
              }
            })
          ).subscribe({
            next: imageUrl => {
              this.userProfile1ImageUrl = imageUrl;
              console.log('URL de imagen de perfil:', this.userProfile1ImageUrl);
            },
            error: error => {
              console.error('Error obteniendo URL de imagen:', error);
              this.userProfile1ImageUrl = 'ruta/a/imagen/predeterminada.png'; // Imagen por defecto
            }
          });
        }
      },
      error: error => {
        console.error('Error al obtener usuario o datos:', error);
      }
    });
  }
  
  isMedico(userData: any): userData is Medico {
    return (
      userData &&
      userData.rol === 'medico' &&
      userData.especialidades !== undefined &&
      userData.aprobadaPorAdmin !== undefined
    );
  }
}
