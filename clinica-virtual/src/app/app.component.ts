import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfService } from './services/pdf.service';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { IdiomaService } from './services/idioma.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  mostrarBoton: boolean = false;
  motrarBotonIngresoGraficosDos: boolean = false;
  mostrarBotonLogin: boolean = false;
  mostrarIdiomas: boolean = false; 
  mostrarBotonDescargaInformePDF: Boolean = false;
  idiomaSeleccionado: string = 'es-ES';
  @Output() idiomaCambiado = new EventEmitter<string>();
  constructor(private router: Router, private pdfService: PdfService, private AuthService: AuthService,
     private idiomaService: IdiomaService ) {
      this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe(event => {
        if (event.url === '/**'
          || event.url === '/home' 
          || event.url === "/menu/paciente"
          || event.url === '/medico/menu'
          || event.url === '/registrar/admin/menu'
          || event.url === '/'
          || event.url === '/login') {
          this.mostrarBoton = false;
          this.motrarBotonIngresoGraficosDos= false;
        } else {
          if(event.url==="/admin/grafico")
          {
            this.motrarBotonIngresoGraficosDos= true;
          }else
          {
            this.motrarBotonIngresoGraficosDos= false;
          }
          this.mostrarBoton = true;
        }
        if(event.url==="/admin/grafico/segunda"){
          this.mostrarBotonDescargaInformePDF = true;
        }else{
          this.mostrarBotonDescargaInformePDF = false;
        }
      });
      this.AuthService.getCurrentUser().subscribe({
        next: (user) => {
          if(user)
            {
              this.mostrarBotonLogin = true;
            }
            else
            {
              this.mostrarBotonLogin = false;
            }
          
        }
      });
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

  volver() {
    this.AuthService.getCurrentUser().subscribe(user => {
      if (user) {
        this.AuthService.getUserRoleByUid(user.uid).subscribe(rol => {
          switch (rol) {
            case 'paciente':
            this.router.navigateByUrl("/menu/paciente");
              break;
            case 'medico':
              this.router.navigateByUrl("/medico/menu");
              break;
            case 'admin':
              this.router.navigateByUrl("/registrar/admin/menu");
              break;
          }
        });
      } else {
        console.log("No hay usuario autenticado");
      }
    });
  }
  irGraficosDos(){
    this.router.navigateByUrl("admin/grafico/segunda");
  }
  descargarInformePDF(){
    this.pdfService.generarInformepdf();
  }
  
}
