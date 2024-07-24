import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {  User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { Medico } from '../../bibliotecas/medico.interface';
import { Turno } from '../../bibliotecas/turno.interface';
import { Administrador } from '../../bibliotecas/administrador.interface';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent {
  currentUser: User | null = null;
  administrador: Administrador | null = null; 
  @Output() administradorEmitido = new EventEmitter<Administrador>();
  userProfile1ImageUrl: string | null = null;
  turnos$: Observable<Turno[]> | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().pipe(
      switchMap(user => {
        this.currentUser = user;

        if (user && user.email) {
          return this.authService.getUserDataByMail(user.email);
        } else {
          return new Observable<Administrador | null>(observer => {
            observer.next(null);
            observer.complete();
          });
        }
      })
    ).subscribe(userData => {
      console.log('Usuario actual:', this.currentUser);
      console.log('Datos del administrador obtenidos:', userData);

      if (userData && this.isAdministrador(userData)) {
        this.administrador = userData;
        console.log('Administrador en turno:', this.administrador);
        this.CargarAdministrador(this.administrador);
      } else {
        console.log('No se encontraron datos del administrador.');
      }

      if (this.currentUser && this.currentUser.uid) {
        const uidPaciente = this.currentUser.uid;
        this.turnos$ = this.authService.getTurnosPaciente(uidPaciente);
        this.authService.getUserProfile1Ur2(this.currentUser.uid).subscribe(
          imageUrl => {
            this.userProfile1ImageUrl = imageUrl;
            console.log('URL de imagen de perfil 1:', this.userProfile1ImageUrl);
          },
          error => {
            console.error('Error obteniendo URL de imagen perfil1:', error);
          }
        );
      }
    });
  }

  CargarAdministrador(administrador: Administrador) {
    this.administradorEmitido.emit(administrador);
  }

  isAdministrador(userData: any): userData is Administrador {
    return (
      userData.uid !== undefined &&
      userData.nombre !== undefined &&
      userData.apellido !== undefined &&
      userData.mail !== undefined &&
      userData.password !== undefined &&
      userData.dni !== undefined &&
      userData.edad !== undefined &&
      userData.rol !== undefined &&
      userData.profileImage !== undefined
    );
  }
}
