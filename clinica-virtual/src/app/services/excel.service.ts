import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Paciente } from '../bibliotecas/paciente.interface';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {


  constructor() { }

  createExcel(pacientes: Paciente[]): void {
    // Definir los encabezados de las columnas
    const header = ['UID', 'Nombre', 'Apellido', 'DNI', 'Obra Social', 'Correo Electrónico'];

    // Mapear los datos de los pacientes a un arreglo de arreglos
    const data = pacientes.map(paciente => [
      paciente.uid,
      paciente.nombre,
      paciente.apellido,
      paciente.dni,
      paciente.obraSocial,
      paciente.mail
    ]);

    // Crear una hoja de trabajo (worksheet)
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([header, ...data]);

    // Crear un libro de trabajo (workbook) y agregar la hoja de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pacientes');

    // Generar el archivo Excel
    XLSX.writeFile(wb, 'pacientes.xlsx');
  }
}
