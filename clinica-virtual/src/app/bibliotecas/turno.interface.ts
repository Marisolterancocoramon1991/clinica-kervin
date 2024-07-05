export interface Turno {
    id: string;
    idPaciente: string;
    fecha: string; // Ajustar tipo de dato según necesidad
    hora: string;
    especialidad: string;
    mailEspecialista: string;
    nombreEspecialista: string;
    comentario: string;
    estado: 'pendiente' | 'confirmado' | 'cancelado' | 'realizado' ; // Ejemplo de estados de turno
  }