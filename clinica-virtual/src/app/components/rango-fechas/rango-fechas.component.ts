import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-rango-fechas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rango-fechas.component.html',
  styleUrl: './rango-fechas.component.css'
})
export class RangoFechasComponent {
  fechaInicio: string = '';
  fechaFin: string = '';

  @Output() rangoSeleccionado = new EventEmitter<{ fechaInicio: string; fechaFin: string }>();

  onFechaCambio(): void {
    if (this.fechaInicio && this.fechaFin) {
      const inicio = new Date(this.fechaInicio).getTime();
      const fin = new Date(this.fechaFin).getTime();

      if (fin < inicio) {
        Swal.fire({
          title: 'Error en las fechas',
          text: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      } else {
        this.rangoSeleccionado.emit({ fechaInicio: this.fechaInicio, fechaFin: this.fechaFin });
      }
    }
  }

}
