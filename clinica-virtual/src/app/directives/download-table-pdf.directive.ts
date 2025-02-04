import { Directive, HostListener, Input } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as moment from 'moment';

@Directive({
  selector: '[appDownloadChartPdf]',
  standalone: true,
})
export class DownloadChartPdfDirective {
  @Input() dataSource: any[] = []; // Datos para la tabla
  @Input() columns: string[] = []; // Columnas de la tabla
  @Input() fileName: string = 'reporte.pdf'; // Nombre del archivo
  @Input() title: string = 'Reporte'; // Título del PDF
  @Input() chartId: string = ''; // ID del canvas del gráfico a capturar

  constructor() {}

  @HostListener('click') async onClick() {
    const doc = new jsPDF();

    // 1. Agregar encabezado
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(this.title);
    const textX = (pageWidth - textWidth) / 2;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(this.title, textX, 20);

    // 2. Agregar fecha
    const fechaArgentina = moment.tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha y hora de emisión: ${fechaArgentina}`, 10, 30);

    // 3. Capturar el gráfico como imagen
    if (this.chartId) {
      const chartElement = document.getElementById(this.chartId);
      if (chartElement) {
        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);

        const pdfWidth = pageWidth - 20; // Margen
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, 'PNG', 10, 40, pdfWidth, pdfHeight);
      } else {
        console.error('No se encontró el elemento con el ID del gráfico:', this.chartId);
      }
    }

    // 4. Agregar tabla de datos
    if (this.dataSource && this.dataSource.length && this.columns.length) {
      const tableData = this.dataSource.map((item) =>
        this.columns.map((column) => item[column] || '-')
      );

      (doc as any).autoTable({
        head: [this.columns], // Encabezados
        body: tableData, // Datos
        startY: this.chartId ? 110 : 40, // Ajusta la posición según el gráfico
        theme: 'grid',
        styles: {
          fontSize: 10,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
        },
      });
    }

    // 5. Descargar el PDF
    doc.save(this.fileName);
  }
}
