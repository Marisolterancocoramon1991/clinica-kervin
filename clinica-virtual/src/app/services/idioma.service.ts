import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {

  constructor() { }
  private idiomaSeleccionado = new BehaviorSubject<string>('es-ES'); // Idioma inicial
  idiomaActual$ = this.idiomaSeleccionado.asObservable(); // Observable para escuchar cambios

  // Cambiar el idioma seleccionado
  cambiarIdioma(idioma: string) {
    this.idiomaSeleccionado.next(idioma); // Notifica a todos los suscriptores
  }
}
