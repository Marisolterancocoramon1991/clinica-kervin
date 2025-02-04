import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfService } from './services/pdf.service';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { IdiomaService } from './services/idioma.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  mostrarIdiomas: boolean = false; // Controla la visibilidad de los botones
  idiomaSeleccionado: string = 'es-ES';
  @Output() idiomaCambiado = new EventEmitter<string>();
  constructor(private router: Router, private pdfService: PdfService, private AuthService: AuthService,
     private idiomaService: IdiomaService ) {
   // this.translate.setDefaultLang('es');
   // this.translate.use('en');
  }

  logout() {
    try {
      this.AuthService.logout();
      this.router.navigate(['/home']);

    } catch (error) {
      console.log('Error al cerrar sesión: ', error);
    }
  }

  // Alterna la visibilidad de los botones de idiomas
  toggleIdiomas() {
    this.mostrarIdiomas = !this.mostrarIdiomas;
  }

  // Cambia el idioma seleccionado
  cambiarIdioma(idioma: string) {
    this.idiomaSeleccionado = idioma;
    this.idiomaService.cambiarIdioma(idioma); 
  }
}
