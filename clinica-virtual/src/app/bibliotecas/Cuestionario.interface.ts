export interface CuestionarioPaciente {
    comentarios: string; // Respuesta al cuadro de texto
    calificacion: number; // Calificación por estrellas
    recomendacion: string; // Radio button (ej. "Sí" o "No")
    aspectos: { [key: string]: boolean }; // Checkboxes (selecciones)
    satisfaccion: number; // Control de rango (1-10)
    idTurno: string | null ;
  }
  