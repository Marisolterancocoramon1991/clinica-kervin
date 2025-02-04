import { Component, QueryList, ViewChildren } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Turno } from '../../bibliotecas/turno.interface';
import { Horario } from '../../bibliotecas/horarioEspecialista.interface'; 
import { Medico } from '../../bibliotecas/medico.interface'; 
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RangoFechasComponent } from '../rango-fechas/rango-fechas.component';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { SortPipe } from '../../pipes/sort.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { HighlightChartDirective } from '../../directives/highlight-chart.directive';
import { DownloadChartPdfDirective } from '../../directives/download-table-pdf.directive';
import { TooltipDirective } from '../../directives/tooltip.directive'; 
 
@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [BaseChartDirective, CommonModule, RangoFechasComponent, 
    CabeceraComponent, SortPipe, TruncatePipe, HighlightChartDirective,
     DownloadChartPdfDirective, TooltipDirective],
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css'],
})
export class GraficosComponent {
  users: any[] = [];
  turnoEspecialidad: any[] = [];
  horariosPorDia: any[] = [];
  medicos: Medico[] = [];
  medicoSeleccionado: Medico | null = null; 
  fechaInicioSeleccionada: string = '';
  fechaFinSeleccionada: string = '';
  ConteoEntradas: { email: string; repeticiones: number; fechas: string[] }[] = [];
  CantidadPorEspecialidad: { especialidad: string; cantidad: number }[] = [];
  conteoTurnosPorDia: { dia: string; cantidad: number }[] = [];
  


  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  barChartData: ChartConfiguration<'bar'>['data'] = {
    datasets: [
      {
        data: [],
        label: 'Cantidad de accesos',
        backgroundColor: [],
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
      },
    ],
    labels: [],
  };
  barChartDataTurnosPorDia: ChartConfiguration<'bar'>['data'] = {
    datasets: [
      {
        data: [],
        label: 'Cantidad de turnos por día',
        backgroundColor: [],
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
      },
    ],
    labels: [],
  };

  barChartDataEspecialidades: ChartConfiguration<'bar'>['data'] = {
    datasets: [
      {
        data: [],
        label: 'Cantidad de turnos por especialidad',
        backgroundColor: [],
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
      },
    ],
    labels: [],
  };
  barChartDataCantidadMedicoRangoTiempo: ChartConfiguration<'bar'>['data'] = {
    datasets: [
      {
        data: [],
        label: 'Cantidad de turnos por médico y rango de tiempo',
        backgroundColor: [],
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
      },
    ],
    labels: [],
  };
  barChartDataCantidadFinalizadosMedicoRangoTiempo: ChartConfiguration<'bar'>['data'] = {
    datasets: [
      {
        data: [],
        label: 'Cantidad de turnos finalizados por médico y rango de tiempo',
        backgroundColor: [],
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
      },
    ],
    labels: [],
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#808080',
          font: {
            family: "'Urbanist', sans-serif",
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#2b2b2b' },
        ticks: {
          color: '#808080',
          font: { family: "'Urbanist', sans-serif", size: 14 },
        },
      },
      y: {
        grid: { color: '#353535' },
        ticks: {
          color: '#808080',
          font: { family: "'Urbanist', sans-serif", size: 14 },
        },
      },
    },
  };

  constructor(private firestore: Firestore, private authService: AuthService) {}

  async ngOnInit() {
    this.users = await this.getAllDocument<any>('entradaUsuario');
    this.turnoEspecialidad = await this.getAllDocument<Turno>('turnos');
    this.horariosPorDia = await this.getAllDocument<Horario>('horarios');

    this.ConteoEntradas = this.contarRepeticionesDeCorreos();
    this.CantidadPorEspecialidad = this.calcularTurnosPorEspecialidad();
    this.conteoTurnosPorDia = this.calcularTurnosPorDia();

    this.authService.obtenerMedicos().subscribe({
      next: (medicos) => {
        this.medicos = medicos; 
        console.log('Lista de médicos:', this.medicos);
      },
      error: (error) => {
        console.error('Error al obtener la lista de médicos:', error);
      },
    });

    // Configurar datos para los gráficos
    this.barChartData.labels = this.ConteoEntradas.map((item) => item.email);
    this.barChartData.datasets[0].data = this.ConteoEntradas.map((item) => item.repeticiones);
    this.barChartData.datasets[0].backgroundColor = this.ConteoEntradas.map(() => 'rgba(240, 252, 161, 1)');

    this.barChartDataEspecialidades.labels = this.CantidadPorEspecialidad.map((item) => item.especialidad);
    this.barChartDataEspecialidades.datasets[0].data = this.CantidadPorEspecialidad.map((item) => item.cantidad);
    this.barChartDataEspecialidades.datasets[0].backgroundColor = this.CantidadPorEspecialidad.map(
      () => 'rgb(250, 150, 152)'
    );
    this.barChartDataTurnosPorDia.labels = this.conteoTurnosPorDia.map((item) => item.dia);
    this.barChartDataTurnosPorDia.datasets[0].data = this.conteoTurnosPorDia.map((item) => item.cantidad);
    this.barChartDataTurnosPorDia.datasets[0].backgroundColor = this.conteoTurnosPorDia.map(() => 'rgb(100, 250, 145)');

    // Actualizar gráficos
    this.actualizarGraficos();
  }

  async getAllDocument<T>(collectionName: string): Promise<T[]> {
    const document: T[] = [];
    const collRef = collection(this.firestore, collectionName);
    const querySnapshot = await getDocs(collRef);

    querySnapshot.forEach((doc) => {
      document.push(doc.data() as T);
    });

    return document;
  }

  contarRepeticionesDeCorreos() {
    const conteo: { email: string; repeticiones: number; fechas: string[] }[] = [];
    this.users.forEach((user) => {
      const email = user?.user?.email;
      const fecha = user?.firstTime?.toDate().toLocaleString();
      if (email) {
        const existente = conteo.find((item) => item.email === email);
        if (existente) {
          existente.repeticiones++;
          if (fecha) {
            existente.fechas.push(fecha);
          }
        } else {
          conteo.push({ email, repeticiones: 1, fechas: fecha ? [fecha] : [] });
        }
      }
    });
    return conteo;
  }
  calcularTurnosPorDia() {
    const conteo: { dia: string; cantidad: number }[] = [];
  
    this.horariosPorDia
      .filter((horario: Horario) => horario.disponibilidad === 'ocupada' || horario.disponibilidad === 'realizado')
      .forEach((horario: Horario) => {
        const dia = horario?.dia; // Asegúrate de que 'dia' esté definido
        if (dia) {
          const existente = conteo.find((item) => item.dia === dia);
          if (existente) {
            existente.cantidad++;
          } else {
            conteo.push({ dia, cantidad: 1 });
          }
        }
      });
  
    console.log('Conteo de turnos por día (filtrado):', conteo);
    return conteo;
  }
  

  calcularTurnosPorEspecialidad() {
    const conteo: { especialidad: string; cantidad: number }[] = [];
    this.turnoEspecialidad.forEach((turno: Turno) => {
      const especialidad = turno?.especialidad;
      if (especialidad) {
        const existente = conteo.find((item) => item.especialidad === especialidad);
        if (existente) {
          existente.cantidad++;
        } else {
          conteo.push({ especialidad, cantidad: 1 });
        }
      }
    });
    console.log('Conteo de turnos por especialidad:', conteo);
    return conteo;
  }

  actualizarGraficos() {
    if (this.charts) {
      this.charts.forEach((chart) => chart.update());
    }
  }

  seleccionarMedico(medico: Medico): void {
    this.medicoSeleccionado = medico; // Actualiza el médico seleccionado
    console.log('Médico seleccionado:', medico);
  }

  filtrarPorRango(rango: { fechaInicio: string; fechaFin: string }): void {
    // Validar si hay un médico seleccionado
    if (!this.medicoSeleccionado) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, seleccione un médico antes de aplicar el filtro.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
  
    console.log('Rango de fechas seleccionado:', rango);
    console.log('Médico seleccionado:', this.medicoSeleccionado);
  
    // Actualiza las variables globales
    this.fechaInicioSeleccionada = rango.fechaInicio;
    this.fechaFinSeleccionada = rango.fechaFin;
  
    // Filtrar y recalcular los datos de turnos por día
    const conteoFiltrado = this.calcularTurnosPorDiaRango(
      rango.fechaInicio,
      rango.fechaFin,
      this.medicoSeleccionado.mail // Pasar el correo del médico seleccionado
    );

    const conteoFiltradoFinalizado = this.calcularTurnosPorDiaRangoFinalizado(
      rango.fechaInicio,
      rango.fechaFin,
      this.medicoSeleccionado.mail // Pasar el correo del médico seleccionado
    );
  
    // Actualizar los datos del gráfico
    this.barChartDataCantidadMedicoRangoTiempo.labels = conteoFiltrado.map((item) => item.dia);
    this.barChartDataCantidadMedicoRangoTiempo.datasets[0].data = conteoFiltrado.map((item) => item.cantidad);
    this.barChartDataCantidadMedicoRangoTiempo.datasets[0].backgroundColor = conteoFiltrado.map(() => 'rgb(100, 150, 250)');
  
    //actualizar el 2 grafico...
    this.barChartDataCantidadFinalizadosMedicoRangoTiempo.labels = conteoFiltradoFinalizado.map((item) => item.dia);
    this.barChartDataCantidadFinalizadosMedicoRangoTiempo.datasets[0].data = conteoFiltradoFinalizado.map((item) => item.cantidad);
    this.barChartDataCantidadFinalizadosMedicoRangoTiempo.datasets[0].backgroundColor = conteoFiltradoFinalizado.map(() => 'rgb(100, 150, 250)');
    // Actualizar gráficos
    this.actualizarGraficos();
  }
  
  calcularTurnosPorDiaRango(
    fechaInicio: string,
    fechaFin: string,
    correoMedico: string
  ): { dia: string; cantidad: number }[] {
    const inicio = new Date(fechaInicio).setHours(0, 0, 0, 0);
    const fin = new Date(fechaFin).setHours(23, 59, 59, 999);
  
    const conteo: { dia: string; cantidad: number }[] = [];
  
    this.horariosPorDia
      .filter((horario: Horario) => {
        const diaHorario = new Date(horario.dia).setHours(0, 0, 0, 0);
        return (
          (horario.disponibilidad === 'ocupada' || horario.disponibilidad === 'realizado') &&
          diaHorario >= inicio &&
          diaHorario <= fin &&
          horario.correoEspecialista === correoMedico // Comparar correos
        );
      })
      .forEach((horario: Horario) => {
        const dia = horario.dia;
        if (dia) {
          const existente = conteo.find((item) => item.dia === dia);
          if (existente) {
            existente.cantidad++;
          } else {
            conteo.push({ dia, cantidad: 1 });
          }
        }
      });
  
    console.log('Conteo de turnos por día (con rango y médico):', conteo);
    return conteo;
  }

  calcularTurnosPorDiaRangoFinalizado(
    fechaInicio: string,
    fechaFin: string,
    correoMedico: string
  ): { dia: string; cantidad: number }[] {
    const inicio = new Date(fechaInicio).setHours(0, 0, 0, 0);
    const fin = new Date(fechaFin).setHours(23, 59, 59, 999);
  
    const conteo: { dia: string; cantidad: number }[] = [];
  
    this.horariosPorDia
      .filter((horario: Horario) => {
        const diaHorario = new Date(horario.dia).setHours(0, 0, 0, 0);
        return (
          (horario.disponibilidad === 'realizado') &&
          diaHorario >= inicio &&
          diaHorario <= fin &&
          horario.correoEspecialista === correoMedico // Comparar correos
        );
      })
      .forEach((horario: Horario) => {
        const dia = horario.dia;
        if (dia) {
          const existente = conteo.find((item) => item.dia === dia);
          if (existente) {
            existente.cantidad++;
          } else {
            conteo.push({ dia, cantidad: 1 });
          }
        }
      });
  
    console.log('Conteo de turnos por día (con rango y médico):', conteo);
    return conteo;
  }
  
}

