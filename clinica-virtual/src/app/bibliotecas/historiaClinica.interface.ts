export interface HistoriaClinica {
    id: string;
    idPaciente: string,
    idEspecialista: string
    idTurno: string;
    altura: number;           // Altura en centímetros o metros
    peso: number;             // Peso en kilogramos
    temperatura: number;      // Temperatura en grados Celsius
    presion: string;          // Presión arterial en formato "120/80" por ejemplo
    datosDinamicos?: {        // Objeto para almacenar pares clave-valor
      [clave: string]: any;   // Clave es una cadena y el valor puede ser de cualquier tipo
    };
  }