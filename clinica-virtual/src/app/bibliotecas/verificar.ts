import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

export class Verificar {
  static registerForm: FormGroup;

  static initializeForm(fb: FormBuilder) {
    this.registerForm = fb.group({
      nombreRegister: ['', [Validators.required, Verificar.esNombreOApellidoValidator]],
      apellidoRegister: ['', [Validators.required, Verificar.esNombreOApellidoValidator]],
      emailRegister: ['', [Validators.required, Validators.email, Verificar.emailValidator]],
      passwordRegister: ['', Validators.required],
      dniRegister: ['', [Validators.required, Verificar.dniValidator]],
      edadRegister: ['', [Validators.required, Verificar.edadValidator(18, 65)]],
      archivoRegister: ['', Validators.required],
    });
  }

  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      return { invalidEmail: true };
    }
    return null;
  }

  static dniValidator(control: AbstractControl): ValidationErrors | null {
    const dni = control.value;
    if (!Verificar.validarDNI(dni)) {
      return { invalidDNI: true };
    }
    return null;
  }

  static edadValidator(min: number, max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const edad = control.value;
      if (!Verificar.validarEdad(edad, min, max)) {
        return { invalidAge: true };
      }
      return null;
    };
  }

  static esNombreOApellidoValidator(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (!Verificar.esNombreOApellido(valor)) {
      return { invalidNameOrSurname: true };
    }
    return null;
  }

  static verificarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static validarDNI(dni: number): boolean {
    const dniStr = dni.toString();
    if (dniStr.length !== 8) {
      return false;
    }
    if (!/^\d+$/.test(dniStr)) {
      return false;
    }
    return true;
  }

  static validarEdad(edad: number, edadMinima: number, edadMaxima: number): boolean {
    return edad >= edadMinima && edad <= edadMaxima;
  }

  static esNombreOApellido(valor: string): boolean {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/;
    return regex.test(valor.trim());
  }

  static validarEspecialidades(especialidades: string[]): boolean {
    const especialidadesPermitidas = [
      'Allergology', 'Anesthesiology', 'Cardiology', 'Dermatology', 'Endocrinology', 
      'Gastroenterology', 'Geriatrics', 'Gynecology', 'Hematology', 'Infectology', 
      'Internal Medicine', 'Nephrology', 'Pulmonology', 'Neurology', 'Nutrition', 
      'Dentistry', 'Ophthalmology', 'Oncology', 'Orthopedics', 'Otolaryngology', 
      'Pediatrics', 'Psychology', 'Psychiatry', 'Radiology', 'Rheumatology', 
      'Traumatology', 'Urology'
    ];

    return especialidades.every(especialidad => especialidadesPermitidas.includes(especialidad));
  }
}
