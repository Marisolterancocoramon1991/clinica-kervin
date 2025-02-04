import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
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
import { Paciente } from '../../bibliotecas/paciente.interface';
import { Specialty } from '../../bibliotecas/especialidad.enum';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FiltroTurnosComponent } from '../filtro-turnos/filtro-turnos.component';


@Component({
  selector: 'app-graficos-dos',
  standalone: true,
  imports: [BaseChartDirective, CommonModule, RangoFechasComponent, 
    CabeceraComponent, SortPipe, TruncatePipe, HighlightChartDirective,
     DownloadChartPdfDirective, TooltipDirective, ReactiveFormsModule,
     FiltroTurnosComponent],
  templateUrl: './graficos-dos.component.html',
  styleUrl: './graficos-dos.component.css'
})
export class GraficosDosComponent implements OnInit {
  Visitas: any[]=[];
  ConteoEntradas: number=0; 
  pacientes: Paciente[]=[];
  pacienteSeleccionado: Paciente | null = null;
  specialtyForm: FormGroup;
  specialties = Object.values(Specialty);
  medicoSeleccionado: Medico | null = null;
  especialidad: string[] = [];
  mailEspecialista: string = '';
  nombreEspecialista: string = '';
  turnos: Turno[]=[];
  conteoPacienteEspecialidad: { especialidad: string; cantidad: number }[] = [];
  conteoTurnosPaciente: { [estado: string]: number } = {};
  medicos: Medico[]=[];
  conteoMedicosPorEspecialidad: { especialidad: string; cantidad: number }[] = [];

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  barChartData: ChartConfiguration<'bar'>['data'] = {
    datasets: [
      {
        data: [],
        label: 'Cantidad de visitas',
        backgroundColor: [],
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
      },
    ],
    labels: [],
  };
  barChartDataMedicoEspecialidad: ChartConfiguration<'bar'>['data'] = {
    datasets: [
      {
        data: [],
        label: 'Cantidad de visitas',
        backgroundColor: [],
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
      },
    ],
    labels: [],
  };
  barChartOptionsMedicoEspecialidad: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#808080',
          font: { family: "'Urbanist', sans-serif", size: 14 },
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

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [], // Estados de los turnos
    datasets: [
      {
        data: [], // Cantidad de turnos por estado
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0'], // Colores
        hoverOffset: 4
      }
    ]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#000',
          font: {
            size: 14,
            family: "'Urbanist', sans-serif"
          },
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];

            // Utilizamos 'this' para acceder al paciente seleccionado
            const pacienteText = this.pacienteSeleccionado
              ? `${this.pacienteSeleccionado.nombre} ${this.pacienteSeleccionado.apellido}`
              : 'No hay paciente seleccionado';

            // Creamos el encabezado de la leyenda con el nombre del paciente
            const labels: any[] = [
              {
                text: `Paciente: ${pacienteText}`,
                fillStyle: 'transparent',
                hidden: false,
                // Estos atributos adicionales ayudan a evitar comportamientos inesperados
                lineCap: '',
                lineDash: [],
                lineDashOffset: 0,
                lineJoin: '',
                strokeStyle: '',
                pointStyle: ''
              }
            ];

            // Verificamos que dataset.data sea un arreglo y lo recorremos para agregar los estados
            if (Array.isArray(dataset.data)) {
              dataset.data.forEach((rawValue, index) => {
                const value = typeof rawValue === 'number' ? rawValue : 0;
                labels.push({
                  text: `${chart.data.labels?.[index] ?? 'Desconocido'} (${value} turnos)`,
                  fillStyle: Array.isArray(dataset.backgroundColor)
                    ? dataset.backgroundColor[index]
                    : '#000',
                  hidden: value === 0,
                  lineCap: '',
                  lineDash: [],
                  lineDashOffset: 0,
                  lineJoin: '',
                  strokeStyle: '',
                  pointStyle: ''
                });
              });
            }
            return labels;
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const chart = tooltipItem.chart;
            const index = tooltipItem.dataIndex;
            const label = chart.data.labels?.[index] ?? 'Turnos';
            const value = typeof tooltipItem.raw === 'number' ? tooltipItem.raw : 0;
            return `${label}: ${value} turnos`;
          }
        }
      }
    }
  };
  
  
  
  
  

  constructor(private firestore: Firestore, private authService: AuthService,private fb: FormBuilder) 
  {
    this.specialtyForm = this.fb.group({
      selectedSpecialties: this.fb.array(this.specialties.map(() => false))
    });
  }
  get selectedSpecialties() {
    return this.specialtyForm.value.selectedSpecialties
      .map((selected: boolean, index: number) => (selected ? this.specialties[index] : null))
      .filter((specialty: string | null) => specialty !== null);
  }

  submit() {
    console.log('Especialidades seleccionadas:', this.selectedSpecialties);
  }

  async ngOnInit() {
    console.log("entro");
    this.Visitas = await this.getAllDocument<any>('entradaUsuario');
    if(this.Visitas)
    this.ConteoEntradas = this.Visitas.length;
    console.log(this.ConteoEntradas);
    this.turnos = await this.getAllDocument<Turno>('turnos');
    this.authService.obtenerPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
      },
      error: (error) => {
        console.error('Error al obtener la lista de médicos:', error);
      },
    });

    this.authService.obtenerMedicos().subscribe({
      next: (medicos) => {
        this.medicos = medicos;
      },
      error: (error) => {
        console.error('Error al obtener la lista de médicos:', error);
      },
    })

    // Configurar datos para los gráficos
    this.barChartData.labels = ['Visitas Totales'];
    this.barChartData.datasets[0].data = [this.ConteoEntradas];
    this.barChartData.datasets[0].backgroundColor = ['rgba(240, 252, 161, 1)'];
  

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
  actualizarGraficos() {
    if (this.charts) {
      this.charts.forEach((chart) => chart.update());
    }
  }

  conteoEspecialidad () {
    

  }

  seleccionarPaciente(paciente: any){
    this.pacienteSeleccionado = paciente;
    this.contarTurnosPorEstadoDelPaciente();
  }
  
  recibirMedicoSeleccionado(medico: Medico) {
    this.medicoSeleccionado = medico;
    this.mailEspecialista = this.medicoSeleccionado.mail;
    this.nombreEspecialista = `${this.medicoSeleccionado.nombre} ${this.medicoSeleccionado.apellido}`;
  }
  recibirEspecialidadSeleccionada(especialidad: any): void {
    this.especialidad = especialidad;
    this.contarTurnosPorEspecialidad();
    this.contarMedicosPorEspecialidad();
  }

  contarTurnosPorEspecialidad(): void {
    if (!this.turnos || this.turnos.length === 0) {
      console.warn('No hay turnos registrados.');
      this.conteoPacienteEspecialidad = []; // Resetea la variable si no hay turnos
      return;
    }
  
    const conteo: { [especialidad: string]: number } = {};
  
    this.turnos.forEach((turno) => {
      const especialidad = turno.especialidad;
      if (especialidad) {
        conteo[especialidad] = (conteo[especialidad] || 0) + 1;
      }
    });
  
    // Guardar en la variable global `this.conteoPacienteEspecialidad`
    this.conteoPacienteEspecialidad = Object.keys(conteo).map((especialidad) => ({
      especialidad,
      cantidad: conteo[especialidad]
    }));
  
    console.log('Turnos por especialidad:', this.conteoPacienteEspecialidad);
  }
  contarTurnosPorEstadoDelPaciente(): void {
    if (!this.pacienteSeleccionado) {
      console.warn('No hay paciente seleccionado.');
      this.conteoTurnosPaciente = {}; // Reinicia el conteo
      return;
    }
  
    if (!this.turnos || this.turnos.length === 0) {
      console.warn('No hay turnos registrados.');
      this.conteoTurnosPaciente = {}; // Reinicia el conteo si no hay turnos
      return;
    }
  
    // Inicializa un objeto para contar los estados de los turnos del paciente
    const conteo: { [estado: string]: number } = {};
  
    this.turnos.forEach((turno) => {
      if (turno.idPaciente === this.pacienteSeleccionado?.uid) {
        conteo[turno.estado] = (conteo[turno.estado] || 0) + 1;
      }
    });
  
    // Guarda el resultado en `this.conteoTurnosPaciente`
    this.conteoTurnosPaciente = conteo;
  
    console.log(`Conteo de turnos del paciente ${this.pacienteSeleccionado.uid}:`, this.conteoTurnosPaciente);
    this.actualizarGrafico();
  }
  actualizarGrafico(): void {
    if (!this.pacienteSeleccionado) {
      console.warn('No hay paciente seleccionado.');
      return;
    }
  
    if (!this.conteoTurnosPaciente || Object.keys(this.conteoTurnosPaciente).length === 0) {
      console.warn('No hay datos de turnos para este paciente.');
      return;
    }
  
    // 🔴 Agregar el nombre del paciente como primer elemento en labels
    this.pieChartData.labels = Object.keys(this.conteoTurnosPaciente); // Estados de los turnos
    this.pieChartData.datasets[0].data = Object.values(this.conteoTurnosPaciente); // Cantidades
  
    console.log(`📊 Gráfico actualizado para ${this.pacienteSeleccionado.nombre} ${this.pacienteSeleccionado.apellido}:`, this.pieChartData);
    
    // 🔴 Forzar actualización del gráfico
    setTimeout(() => {
      this.charts.forEach(chart => chart.update());
    }, 100);
  }
  contarMedicosPorEspecialidad(): void {
    // Verificar si hay médicos registrados
    if (!this.medicos || this.medicos.length === 0) {
      console.warn('No hay médicos registrados.');
      this.conteoMedicosPorEspecialidad = []; // Resetea el conteo si no hay médicos
      return;
    }
  
    // Objeto para acumular el conteo por especialidad
    const conteo: { [especialidad: string]: number } = {};
  
    // Recorrer cada médico de la lista
    this.medicos.forEach((medico) => {
      // Verificar que el médico tenga la propiedad 'especialidades'
      if (medico.especialidades) {
        // Si 'especialidades' es un arreglo, recorrer cada especialidad
        if (Array.isArray(medico.especialidades)) {
          medico.especialidades.forEach((especialidad: string) => {
            conteo[especialidad] = (conteo[especialidad] || 0) + 1;
          });
        } else {
          // Si es un string (única especialidad)
          const especialidad = medico.especialidades;
          conteo[especialidad] = (conteo[especialidad] || 0) + 1;
        }
      }
    });
  
    // Transformar el objeto de conteo en un arreglo para facilitar su uso en la vista
    this.conteoMedicosPorEspecialidad = Object.keys(conteo).map((especialidad) => ({
      especialidad,
      cantidad: conteo[especialidad]
    }));
    
    this.barChartDataMedicoEspecialidad.labels = this.conteoMedicosPorEspecialidad.map(item => item.especialidad);

    // Asigna los datos (cantidad de médicos por especialidad)
    this.barChartDataMedicoEspecialidad.datasets[0].data = this.conteoMedicosPorEspecialidad.map(item => item.cantidad);
  
    // Opcional: asignar colores a cada barra. Se puede utilizar un arreglo de colores predeterminado
    const defaultColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0', '#2196F3', '#FF5722', '#795548', '#00BCD4'];
    this.barChartDataMedicoEspecialidad.datasets[0].backgroundColor =
      this.conteoMedicosPorEspecialidad.map((_, index) => defaultColors[index % defaultColors.length]);
  
    console.log('Médicos por especialidad:', this.conteoMedicosPorEspecialidad);
    setTimeout(() => {
      this.charts.forEach(chart => chart.update());
    }, 100);
  }
}
