export interface Turno {
    id: string;
    idPaciente: string;
    idHorario?: string;
    especialidad: any;
    mailEspecialista: string;
    nombreEspecialista: string;
    comentario: string;
    estado: 'pendiente' | 'confirmado' | 'cancelado' | 'realizado' | 'rechazado'| 'aceptado' | 'Cargahistorial'; // Ejemplo de estados de turno
  }