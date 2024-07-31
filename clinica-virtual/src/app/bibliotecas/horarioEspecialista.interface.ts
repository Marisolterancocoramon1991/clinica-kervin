export interface Horario {
  id?: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  correoEspecialista: string;
  disponibilidad: 'abierta' | 'ocupada'| 'cancelada' | 'rechazada'| 'realizado';
}

  