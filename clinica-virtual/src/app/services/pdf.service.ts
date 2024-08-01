import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Paciente } from '../bibliotecas/paciente.interface';
import { Medico } from '../bibliotecas/medico.interface';
import { HistoriaClinica } from '../bibliotecas/historiaClinica.interface';
import * as moment from 'moment-timezone';
import { forkJoin } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }
  generatePdf(paciente: Paciente, medico: Medico, historiaClinica: HistoriaClinica) {
    // Crea una instancia de jsPDF
    const doc = new jsPDF();
    const fechaArgentina = moment.tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');

    // Ruta del logo   
    const logoUrl = 'logo_clinica.jpg'; // Asegúrate de que esta ruta sea correcta

    // Cargar el logo como una imagen
    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
      // Añade el logo redondeado
      const logoWidth = 50;
      const logoHeight = 50;
      const logoX = 10;
      const logoY = 10;
      doc.addImage(this.createRoundedImage(img), 'JPEG', logoX, logoY, logoWidth, logoHeight);

      // Calcular la posición del texto centrado con respecto al logo y el borde derecho
      const pageWidth = doc.internal.pageSize.width;
      const textWidth1 = doc.getTextWidth('República Argentina');
      const textWidth2 = doc.getTextWidth('Clínica Virtual Dr. Kervin Briceño');
      const textWidth3 = doc.getTextWidth('Historia Clínica');
      const maxTextWidth = Math.max(textWidth1, textWidth2, textWidth3);

      const textX = logoX + logoWidth + (pageWidth - logoX - logoWidth - maxTextWidth) / 2;

      // Agrega la cabecera
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('República Argentina', textX, 20);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Clínica Virtual Dr. Kervin Briceño', textX, 30);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Historia Clínica', textX, 40);


      // Agregar fecha
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(` 
                              Fecha y hora de emision del documento: ${fechaArgentina}`, 10, 60);

      // Agregar información del paciente
      let yPosition = 70;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Paciente:', 10, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre: ${paciente.nombre}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Apellido: ${paciente.apellido}`, 10, yPosition);
      yPosition += 5;
      doc.text(`DNI: ${paciente.dni}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Obra Social: ${paciente.obraSocial}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Correo Electrónico: ${paciente.mail}`, 10, yPosition);
      yPosition += 10;

      // Agregar información del médico
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Especialista:', 10, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre: ${medico.nombre}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Apellido: ${medico.apellido}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Correo Electrónico: ${medico.mail}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Especialidades: ${medico.especialidades.join(', ')}`, 10, yPosition);
      yPosition += 10;

      // Agregar información de la historia clínica
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Información Historia Clínica:', 10, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Altura: ${historiaClinica.altura}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Peso: ${historiaClinica.peso}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Presión: ${historiaClinica.presion}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Temperatura: ${historiaClinica.temperatura}`, 10, yPosition);
      yPosition += 5;

      // Datos dinámicos de la historia clínica
      const datosDinamicos = historiaClinica.datosDinamicos ?? [];
      if (datosDinamicos.length > 0) {
        doc.text(`Datos variables: ${datosDinamicos.join(', ')}`, 10, yPosition);
      } else {
        doc.text(`Datos variables: No disponibles`, 10, yPosition);
      }

      // Guarda el archivo PDF
      doc.save(`historia_clinica_${paciente.nombre}_${paciente.dni}_${historiaClinica.id}.pdf`);
    };
  }

  private createRoundedImage(image: HTMLImageElement): string {
    // Crear un canvas para redondear la imagen
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const diameter = Math.min(image.width, image.height);
    canvas.width = diameter;
    canvas.height = diameter;

    // Dibujar la imagen redondeada en el canvas
    ctx.beginPath();
    ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(image, (image.width - diameter) / 2, (image.height - diameter) / 2, diameter, diameter, 0, 0, diameter, diameter);

    return canvas.toDataURL('image/jpeg');
  }
}

