import { Injectable } from '@angular/core';
import { Firestore, Timestamp, DocumentReference } from '@angular/fire/firestore';
import { addDoc, collection, getDoc, setDoc, getDocs, updateDoc, doc, query, where, DocumentData, docData } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, authState, user, User } from '@angular/fire/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, throwError } from 'rxjs';
import { map,switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Turno } from '../bibliotecas/turno.interface';
import { catchError } from 'rxjs/operators';
import { Paciente } from '../bibliotecas/paciente.interface';
import {Medico} from '../bibliotecas/medico.interface';
import { Horario } from '../bibliotecas/horarioEspecialista.interface';
import { ComentarioPaciente } from '../bibliotecas/comenatrioPaciente.interface';
import { Calificacion } from '../bibliotecas/calificacion.interface';
import { HistoriaClinica } from '../bibliotecas/historiaClinica.interface';
import { CuestionarioPaciente } from '../bibliotecas/Cuestionario.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authF: Auth, private firestore: Firestore, private router: Router) { }

  async registerPaciente(nombre: string, apellido: string, mail: string, password: string, dni: number, edad: number, obraSocial: string, file1: File, file2: File): Promise<void> {
    try {
      console.log('Iniciando registro del paciente...');
      console.log('Datos del paciente:', { nombre, apellido, mail, password, dni, edad, obraSocial });
  
      // Registro del usuario
      const userCredential = await createUserWithEmailAndPassword(this.authF, mail, password);
      const user = userCredential.user;
      console.log('Usuario registrado:', user);
  
      // Envío de correo de verificación
      await sendEmailVerification(user);
      console.log('Correo de verificación enviado a:', mail);
  
      Swal.fire({
        icon: 'info',
        title: 'Verificación de Email',
        text: 'Se ha enviado un correo de verificación. Por favor verifica tu email antes de continuar.',
      });
      
      // Verificación del correo electrónico
      const checkEmailVerified = setInterval(async () => {
        await user.reload();
        console.log('Verificando email. Estado actual:', user.emailVerified);
        if (user.emailVerified) {
          clearInterval(checkEmailVerified);
          console.log('Email verificado. Guardando datos del paciente...');
          await this.saveUserDataPaciente(user, nombre, apellido, password, dni, edad, obraSocial, file1, file2);
          console.log('Datos del paciente guardados exitosamente.');
        }
      }, 5000);
    } catch (error) {
      console.error('Error registrando Paciente:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error intentando registrar',
      });
    }
  }
  
  private async saveUserDataPaciente(user: any, nombre: string, apellido: string, password: string, dni: number, edad: number, obraSocial: string, file1: File, file2: File): Promise<void> {
    try {
      console.log('Iniciando guardado de datos del paciente...');
      console.log('Datos a guardar:', { nombre, apellido, dni, edad, obraSocial, email: user.email });
  
      const storage = getStorage();
      const storageRef = ref(storage);
  
      const file1Ref = ref(storageRef, `usuarios/${user.uid}/perfil1`);
      const file2Ref = ref(storageRef, `usuarios/${user.uid}/perfil2`);
      
      console.log('Subiendo archivo 1...');
      const uploadFile1 = await uploadBytes(file1Ref, file1);
      console.log('Archivo 1 subido:', uploadFile1);
  
      console.log('Subiendo archivo 2...');
      const uploadFile2 = await uploadBytes(file2Ref, file2);
      console.log('Archivo 2 subido:', uploadFile2);
  
      const downloadURL1 = await getDownloadURL(uploadFile1.ref);
      const downloadURL2 = await getDownloadURL(uploadFile2.ref);
      console.log('URLs de descarga:', { downloadURL1, downloadURL2 });
  
      const col = collection(this.firestore, '/usuarios');
      await addDoc(col, {
        uid: user.uid,
        nombre: nombre,
        apellido: apellido,
        mail: user.email,
        password: password,
        dni: dni,
        edad: edad,
        obraSocial: obraSocial,
        emailVerified: user.emailVerified,
        rol: 'paciente',
        profileImages: [downloadURL1, downloadURL2]
      });
      console.log('Datos del paciente guardados en la base de datos.');
    } catch (error) {
      console.error('Error guardando datos del paciente:', error);
    }
  }
  
  async registerMedico(nombre: string, apellido: string, mail: string, password: string, dni: number, edad: number, especialidades: string[], file: File): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.authF, mail, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      console.log('Correo de verificación enviado a:', mail);

      Swal.fire({
        icon: 'info',
        title: 'Verificación de Email',
        text: 'Se ha enviado un correo de verificación. Por favor verifica tu email antes de continuar.',
      });

      const checkEmailVerified = setInterval(async () => {
        await user.reload();
        console.log('Verificando email. Estado actual:', user.emailVerified);
        if (user.emailVerified) {
          clearInterval(checkEmailVerified);
          console.log('Email verificado. Guardando datos del médico...');
          await this.saveUserDataMedico(user, nombre, apellido, password, dni, edad, especialidades, file);
          console.log('Datos del médico guardados exitosamente.');
        }
      }, 5000);
    } catch (error) {
      console.error('Error registrando Medico:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error intentando registrar',
      });
    }
  }
  private async saveUserDataMedico(user: any, nombre: string, apellido: string, password : string, dni: number, edad: number, especialidades: string[], file: File): Promise<void> {
    const storage = getStorage();
    const storageRef = ref(storage);

    const fileref = ref(storageRef, `usuarios/${user.uid}/perfil`);
    const uploadFile = await uploadBytes(fileref, file);
    const downloadURL = await getDownloadURL(uploadFile.ref);

    const col = collection(this.firestore, '/usuarios');

    await addDoc(col, {
      uid: user.uid,
      nombre: nombre,
      apellido: apellido,
      mail: user.email,
      password: password,
      dni: dni,
      edad: edad,
      especialidades: especialidades,
      aprobadaPorAdmin: false,
      rol: 'medico',
      profileImage: downloadURL
    });
  }

  async registerAdmin(nombre: string, apellido: string, mail: string, password: string, dni: number, edad: number,file: File): Promise<void>{
    try {
      const userCredential = await createUserWithEmailAndPassword(this.authF, mail, password);
      const user = userCredential.user;
      this.saveUserDataAdmin(user, nombre, apellido, password, dni, edad, file);
      //this.router.navigate(["/home/login"]);
    } catch (error) {
      console.error('Error registrando Administrador:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error intentando registrar',
      });
    }
  }
  private async saveUserDataAdmin(user: any, nombre: string, apellido: string, password: string, dni: number, edad: number, file: File): Promise<void>{
    const storage = getStorage();
    const storageRef = ref(storage);

    const fileref = ref(storageRef, `usuarios/${user.uid}/perfil1`);
    const uploadFile = await uploadBytes(fileref, file);
    const downloadURL = await getDownloadURL(uploadFile.ref);

    const col = collection(this.firestore, '/usuarios');

    await addDoc(col, {
      uid: user.uid,
      nombre: nombre,
      apellido: apellido,
      mail: user.email,
      password: password,
      dni: dni,
      edad: edad,
      rol: 'admin',
      profileImage: downloadURL
    });
  }

  async add(collectionName: string, data: any): Promise<void> {
    const collRef = collection(this.firestore, collectionName);
    console.log("entro");
    await addDoc(collRef, data);
    console.log("FIN DEL METODO ADD");
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.authF, email, password);
      const user = userCredential.user;
      const rol = await this.getUserRoleByUid(user.uid).toPromise();
      switch (rol) {
        case 'paciente':
          console.log("ES UN PACIENTE");
          await this.signInPaciente(user);

          await this.add("entradaUsuario", {
            user: {
              fullName: user.displayName,
              email: user.email,
              picture: user.photoURL
            },
            entryTime: new Date()
          });
          break;
        case 'medico':
          await this.signInMedico(user);

          await this.add("entradaUsuario", {
            user: {
              fullName: user.displayName,
              email: user.email,
              picture: user.photoURL
            },
            entryTime: new Date()
          });
          break;
        case 'admin':
          await this.add("entradaUsuario", {
            user: {
              fullName: user.displayName,
              email: user.email,
              picture: user.photoURL
            },
            entryTime: new Date()
          });
          break;
        default:
          await signOut(this.authF);
          Swal.fire({
            icon: 'warning',
            title: 'Verificación de Email',
            text: 'Tu email no está verificado. Por favor verifica tu email antes de iniciar sesión.',
          });
          break;
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error intentando iniciar sesión',
      });
    }
  }
  async logout(): Promise<void> {
    try {
      // Obtén el usuario autenticado actualmente
      const currentUser = this.authF.currentUser;
  
      // Valida que el usuario exista antes de proceder
      if (!currentUser) {
        console.error("No hay un usuario autenticado.");
        throw new Error("No se encontró un usuario autenticado para registrar la salida.");
      }
  
      // Realiza el logout
      await signOut(this.authF);
      console.log('Logout successful');
  
      // Registra la salida del usuario
      await this.add("salidaUsuario", {
        user: {
          email: currentUser.email || "Correo no disponible", // Validación de seguridad
        },
        entryTime: new Date()
      });
  
      // Navega a la página de inicio
      this.router.navigate(["/home"]);
  
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error intentando cerrar la sesión.',
      });
      throw error;
    }
  }
  obtenerMedicos(): Observable<Medico[]> {
    const medicosRef = collection(this.firestore, 'usuarios');
    const medicoQuery = query(medicosRef, where('rol', '==', 'medico')); // Filtrar solo por rol "medico"

    return new Observable<Medico[]>((observer) => {
      getDocs(medicoQuery)
        .then((querySnapshot) => {
          const medicos: Medico[] = [];
          querySnapshot.forEach((doc) => {
            medicos.push(doc.data() as Medico); // Convertir cada documento a un objeto Medico
          });
          observer.next(medicos); // Emitir la lista de médicos
          observer.complete();
        })
        .catch((error) => {
          observer.error(error); // Manejar errores
        });
    });
  }
  

  getUserRoleByUid(uid: string): Observable<string | null> {
    const userCollectionRef = collection(this.firestore, 'usuarios');
    const userQuery = query(userCollectionRef, where('uid', '==', uid));

    return from(getDocs(userQuery)).pipe(
      map(querySnapshot => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as { rol: string };
          return userData.rol;
        } else {
          return null;
        }
      })
    );
  }
  async signInPaciente(user: any) {
    try {
      if (!user.emailVerified) {
        await signOut(this.authF);

        Swal.fire({
          icon: 'warning',
          title: 'Verificación de Email',
          text: 'Tu email no está verificado. Por favor verifica tu email antes de iniciar sesión.',
        });
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error intentando iniciar sesión',
      });
    }
  }
  async signInMedico(user: any) {
    try {
      const aprobadaPorAdmin = await this.getUserAprobadoPorAdminByUid(user.uid).toPromise();
      if (!aprobadaPorAdmin) {
        Swal.fire({
          icon: 'warning',
          title: 'Cuenta NO Aprobada',
          text: 'Tu Cuenta todavia no fue Verificada por Nuestro Equipo.',
        });
        await signOut(this.authF);
      }
    } catch (error) {
      console.error('Error checking approval status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error verificando el estado de aprobación.',
      });
    }
  }
  getUserAprobadoPorAdminByUid(uid: string): Observable<string | null> {
    const userCollectionRef = collection(this.firestore, 'usuarios');
    const userQuery = query(userCollectionRef, where('uid', '==', uid));

    return from(getDocs(userQuery)).pipe(
      map(querySnapshot => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as { aprobadaPorAdmin: string };
          return userData.aprobadaPorAdmin;
        } else {
          return null;
        }
      })
    );
  }

  async getUsers(): Promise<any[]> {
    const usersCollection = collection(this.firestore, 'usuarios');
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users;
  }

  async updateUserAprobadaPorAdmin(uid: string, value: boolean): Promise<void> {
    const usersCollection = collection(this.firestore, 'usuarios');
    const userQuery = query(usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userDocRef = doc(this.firestore, `usuarios/${userDoc.id}`);
      await updateDoc(userDocRef, { aprobadaPorAdmin: value });
    } else {
      throw new Error('User not found');
    }
  }

  getCurrentUser(): Observable<User | null> {
    return authState(this.authF);
  }

  isLoggedIn(): Observable<boolean> {
    return authState(this.authF).pipe(
      map(user => !!user)
    );
  }
  isAdmin(uid: string): Observable<boolean> {
    const userCollectionRef = collection(this.firestore, 'usuarios');
    const userQuery = query(userCollectionRef, where('uid', '==', uid));

    return from(getDocs(userQuery)).pipe(
      map(querySnapshot => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as { rol: string };
          return userData.rol === 'admin';
        } else {
          return false;
        }
      })
    );
  }

  isUserPatient(uid: string): Observable<boolean> {
    const userCollectionRef = collection(this.firestore, 'usuarios');
    const userQuery = query(userCollectionRef, where('uid', '==', uid));

    return from(getDocs(userQuery)).pipe(
      map(querySnapshot => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as { rol: string };
          return userData.rol === 'paciente';
        } else {
          return false;
        }
      })
    );
  }
  isUserSpecialist(uid: string): Observable<boolean> {
    const userCollectionRef = collection(this.firestore, 'usuarios');
    const userQuery = query(userCollectionRef, where('uid', '==', uid));

    return from(getDocs(userQuery)).pipe(
      map(querySnapshot => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as { rol: string };
          return userData.rol === 'medico';
        } else {
          return false;
        }
      })
    );
  }
  getTurnosPaciente(uid: string): Observable<Turno[]> {
    const turnosCollectionRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosCollectionRef, where('idPaciente', '==', uid));
  
    return from(getDocs(turnosQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Turno,
          id: doc.id
        }));
      })
    );
  }
  getPacienteUid(uid: string): Observable<Paciente | null> {
    const turnosCollectionRef = collection(this.firestore, 'usuarios');
    const turnosQuery = query(turnosCollectionRef, where('uid', '==', uid));
  
    return from(getDocs(turnosQuery)).pipe(
      map(querySnapshot => {
        const doc = querySnapshot.docs[0];
        return doc ? { ...doc.data() as Paciente, id: doc.id } : null;
      })
    );
  }

  getIdPacientesTurnosRealizados(correoEspecialista: string): Observable<string[]> {
    const turnosCollectionRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosCollectionRef, 
      where('mailEspecialista', '==', correoEspecialista), 
      where('estado', '==', 'realizado')
    ); 
    return from(getDocs(turnosQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const turno = doc.data() as Turno;
          return turno.idPaciente;
        });
      })
    );
  }

  getIdPacientesTurnosRealizados2(id: string): Observable<Turno[]> {
    const turnosCollectionRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosCollectionRef, 
      where('idPaciente', '==', id), 
      where('estado', '==', 'realizado')
    ); 
    return from(getDocs(turnosQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const turno = doc.data() as Turno;
          return turno;
        });
      })
    );
  }
  
  setTurno(turno: Turno): Observable<void> {
    try {
      const { id, ...turnoData } = turno; // Extraer id y datos del turno
      const turnoDocRef = doc(collection(this.firestore, 'turnos'), id);

      return from(setDoc(turnoDocRef, turnoData)).pipe(
        catchError(error => {
          console.error('Error al setear el turno:', error);
          return throwError('Ocurrió un error al setear el turno');
        })
      );
    } catch (error) {
      console.error('Error en el try-catch al setear el turno:', error);
      return throwError('Ocurrió un error inesperado');
    }
  }
  getUserProfile1Url(uid: string): Observable<string | null> {
    const storage = getStorage();
    const storageRef = ref(storage, `usuarios/${uid}/perfil1`);
    
    return from(getDownloadURL(storageRef)).pipe(
      catchError(error => {
        console.error('Error obteniendo URL de imagen perfil1:', error);
        return throwError('Ocurrió un error al obtener la URL de la imagen perfil1');
      })
    );
  }
  getUserProfile1Ur2(uid: string): Observable<string | null> {
    const storage = getStorage();
    const storageRef = ref(storage, `usuarios/${uid}/perfil`);
    
    return from(getDownloadURL(storageRef)).pipe(
      catchError(error => {
        console.error('Error obteniendo URL de imagen perfil:', error);
        return throwError('Ocurrió un error al obtener la URL de la imagen perfil');
      })
    );
  }
  getUserDataByMail(mail: string): Observable<Paciente | null> {
    const userCollectionRef = collection(this.firestore, 'usuarios');
    const userQuery = query(userCollectionRef, where('mail', '==', mail));

    return from(getDocs(userQuery)).pipe(
      map(querySnapshot => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as Paciente;
          return userData;
        } else {
          return null;
        }
      })
    );
  }
  getMedicosByEspecialidad(especialidad: string): Observable<Medico[]> {
    const medicoCollectionRef = collection(this.firestore, 'usuarios');
    const medicoQuery = query(medicoCollectionRef, where('rol', '==', 'medico'), where('especialidades', 'array-contains', especialidad));

    return from(getDocs(medicoQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Medico,
          id: doc.id
         
        })) as Medico[];
      })
    );
  }

  getMedicosByNombre(nombre: string): Observable<Medico[]> {
    const medicoCollectionRef = collection(this.firestore, 'usuarios');
    const medicoQuery = query(medicoCollectionRef, where('rol', '==', 'medico'), where('nombre', '==', nombre));
  
    return from(getDocs(medicoQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Medico,
          id: doc.id
        })) as Medico[];
      })
    );
  }

  getMedicosByMail(mail: string): Observable<Medico[]> {
    const medicoCollectionRef = collection(this.firestore, 'usuarios');
    const medicoQuery = query(medicoCollectionRef, where('rol', '==', 'medico'), where('mail', '==',  mail));
  
    return from(getDocs(medicoQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Medico,
          id: doc.id
        })) as Medico[];
      })
    );
  }
  getHorariosEspecialista(correoEspecialista: string): Observable<Horario[]> {
   const horarioCollecitonRef= collection(this.firestore, 'horarios');
   const horarioQuery = query(horarioCollecitonRef,
    where('correoEspecialista', '==',  correoEspecialista));
    return from(getDocs(horarioQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Horario,
          id: doc.id
        })) as Horario[];
      })
    );

  }
  updateTurnoCancelado(turno: Turno): Observable<void> {
    const turnoDocRef = doc(this.firestore, `turnos/${turno.id}`);
    return new Observable<void>((observer) => {
      updateDoc(turnoDocRef, { estado: 'cancelado', comentario: turno.comentario })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
  

  updateHorarioCancelada(horario: Horario): Observable<void> {
    const horarioDocRef = doc(this.firestore, `horarios/${horario.id}`);
    return new Observable<void>((observer) => {
      updateDoc(horarioDocRef, { disponibilidad: 'cancelada' })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
  updateHorarioCanceladoById(idHorario: string): Observable<void> {
    const horarioDocRef = doc(this.firestore, `horarios/${idHorario}`);
    return new Observable<void>((observer) => {
      updateDoc(horarioDocRef, { disponibilidad: 'cancelada' })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
  updateHorarioRechazadoById(idHorario: string): Observable<void> {
    const horarioDocRef = doc(this.firestore, `horarios/${idHorario}`);
    return new Observable<void>((observer) => {
      updateDoc(horarioDocRef, { disponibilidad: 'rechazada' })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
  
  updateHorarioRealizadoById(idHorario: string): Observable<void> {
    const horarioDocRef = doc(this.firestore, `horarios/${idHorario}`);
    return new Observable<void>((observer) => {
      updateDoc(horarioDocRef, { disponibilidad: 'realizado' })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  updateHorarioAbiertoById(idHorario: string): Observable<void> {
    const horarioDocRef = doc(this.firestore, `horarios/${idHorario}`);
    return new Observable<void>((observer) => {
      updateDoc(horarioDocRef, { disponibilidad: 'abierta' })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
  updateHorarioOcupado(horario: Horario): Observable<void> {
    const horarioDocRef = doc(this.firestore, `horarios/${horario.id}`);
    return new Observable<void>((observer) => {
      updateDoc(horarioDocRef, { disponibilidad: 'ocupada' })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }



  /*saveHorario(horario: Horario): Observable<DocumentReference<DocumentData>> {
    const horarioCollectionRef = collection(this.firestore, 'horarios');
    return from(addDoc(horarioCollectionRef, horario));
  }*/
 /* saveHorario(horario: Horario): Observable<Horario> {
    const horarioCollectionRef = collection(this.firestore, 'horarios');
    return from(addDoc(horarioCollectionRef, horario)).pipe(
      map((docRef: DocumentReference<DocumentData>) => {
        // Añade el ID generado al objeto Horario y lo retorna
        return { ...horario, id: docRef.id };
      })
    );
  }*/
    saveHorario(horario: Horario): Observable<Horario> {
      const horarioCollectionRef = collection(this.firestore, 'horarios');
      
      // Agrega el documento y luego actualiza con el ID
      return from(addDoc(horarioCollectionRef, {})).pipe(
        switchMap((docRef: DocumentReference<DocumentData>) => {
          const horarioConId = { ...horario, id: docRef.id };
          const horarioDocRef = doc(this.firestore, `horarios/${docRef.id}`);
          return from(updateDoc(horarioDocRef, horarioConId)).pipe(
            map(() => horarioConId)
          );
        })
      );
    }

  
  getAllMedicos(): Observable<Medico[]> {
    const medicoCollectionRef = collection(this.firestore, 'usuarios');
    const medicoQuery = query(medicoCollectionRef, where('rol', '==', 'medico'));
  
    return from(getDocs(medicoQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Medico,
          id: doc.id
        })) as Medico[];
      })
    );
  }
  
  saveTurno(turno: Turno): Observable<Turno> {
    const turnosCollectionRef = collection(this.firestore, 'turnos');
  
    // Agrega el documento vacío primero
    return from(addDoc(turnosCollectionRef, {})).pipe(
      switchMap((docRef: DocumentReference<DocumentData>) => {
        // Crea un turno con el ID obtenido
        const turnoConId = { ...turno, id: docRef.id };
        // Actualiza el documento con los datos del turno y el ID
        const turnoDocRef = doc(this.firestore, `turnos/${docRef.id}`);
        return from(updateDoc(turnoDocRef, turnoConId)).pipe(
          map(() => turnoConId)
        );
      })
    );
  }
  obtenerPacientes(): Observable<Paciente[]> {
    const pacienteCollectionRef = collection(this.firestore, 'usuarios');
    const pacienteQuery = query(pacienteCollectionRef, where('rol', '==', 'paciente'));
  
    return from(getDocs(pacienteQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Paciente,
          id: doc.id
        })) as Paciente[];
      })
    );
  }
  GetPacientePorCorreo(correo: string): Observable<Paciente | null> {
    const pacienteCollectionRef = collection(this.firestore, 'usuarios');
    const pacienteQuery = query(pacienteCollectionRef, where('mail', '==', correo));
    
    return from(getDocs(pacienteQuery)).pipe(
      map(querySnapshot => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          return {
            ...doc.data() as Paciente,
            id: doc.id
          } as Paciente;
        } else {
          return null;
        }
      })
    );
  }
  GetPacientePorUID(uid: string): Observable<Paciente | null> {
    const pacienteCollectionRef = collection(this.firestore, 'usuarios');
    const pacienteQuery = query(pacienteCollectionRef, where('uid', '==', uid));

    return from(getDocs(pacienteQuery)).pipe(
      map(querySnapshot => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          return {
            ...doc.data() as Paciente,
            id: doc.id
          } as Paciente;
        } else {
          return null;
        }
      })
    );
  }
  getTurnosPorPacienteEspecialistaYEspecialidad(paciente: Paciente, medico: Medico, especialidad: string): Observable<Turno[]> {
    const turnosCollectionRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(
      turnosCollectionRef,
      where('idPaciente', '==', paciente.uid),
      where('mailEspecialista', '==', medico.mail),
      where('especialidad', '==', especialidad)
    );

    return from(getDocs(turnosQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Turno,
          id: doc.id
        })) as Turno[];
      })
    );
  }
 
  getTurnosPorMailEspecialista(mailEspecialista: string): Observable<Turno[]> {
    const turnosCollectionRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosCollectionRef, where('mailEspecialista', '==', mailEspecialista));

    return from(getDocs(turnosQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Turno,
          id: doc.id
        })) as Turno[];
      })
    );
  }
  getTurnosPorPacienteId(idPaciente: string): Observable<Turno[]> {
    const turnosCollectionRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosCollectionRef, 
      where('idPaciente', '==', idPaciente),
      where('estado', '==', 'realizado') // Asegúrate de que el estado esté configurado correctamente
    );
  
    return from(getDocs(turnosQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Turno,
          id: doc.id
        })) as Turno[];
      })
    );
  }
  getTurnosPorMailYEspecialidad(mailEspecialista: string, especialidad: string): Observable<Turno[]> {
    const turnosCollectionRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(
      turnosCollectionRef,
      where('mailEspecialista', '==', mailEspecialista),
      where('especialidad', '==', especialidad) // Asegúrate de que 'especialidad' es el campo correcto
    );

    return from(getDocs(turnosQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Turno,
          id: doc.id
        })) as Turno[];
      })
    );
  }
  updateTurnoRechazado(turno: Turno): Observable<void> {
    const turnoDocRef = doc(this.firestore, `turnos/${turno.id}`);
    return new Observable<void>((observer) => {
      updateDoc(turnoDocRef, { estado: 'rechazado' })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
  updateHistoriaClinica(historiaClinica: HistoriaClinica): Observable<void> {
    const historiaDocRef = doc(this.firestore, `historiasClinicas/${historiaClinica.id}`);
    return new Observable<void>((observer) => {
      updateDoc(historiaDocRef, {
        altura: historiaClinica.altura,
        peso: historiaClinica.peso,
        temperatura: historiaClinica.temperatura,
        presion: historiaClinica.presion,
        datosDinamicos: historiaClinica.datosDinamicos
      })
      .then(() => {
        observer.next();
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
    });
  }
  updateTurnoAceptado(turno: Turno): Observable<void> {
    const turnoDocRef = doc(this.firestore, `turnos/${turno.id}`);
    return new Observable<void>((observer) => {
      updateDoc(turnoDocRef, { estado: 'aceptado' })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
  updateTurnoRealizado(turno: Turno): Observable<void> {
    const turnoDocRef = doc(this.firestore, `turnos/${turno.id}`);
    return new Observable<void>((observer) => {
      updateDoc(turnoDocRef, { estado: 'realizado' })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
  updateTurnoHistoriaCargada(turno: Turno): Observable<void> {
    const turnoDocRef = doc(this.firestore, `turnos/${turno.id}`);
    return new Observable<void>((observer) => {
      updateDoc(turnoDocRef, { estado: 'Cargahistorial' })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

   getTurnosPorParametros(mailEspecialista: string, especialidad: string, idPaciente: string): Observable<Turno[]> {
    const turnosCollectionRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(
      turnosCollectionRef,
      where('mailEspecialista', '==', mailEspecialista),
      where('especialidad', '==', especialidad),
      where('idPaciente', '==', idPaciente) // Filtro adicional por idPaciente
    );

    return from(getDocs(turnosQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Turno,
          id: doc.id
        })) as Turno[];
      })
    );
  }
  getTurnosRealizadosClientes(mailEspecialista: string): Observable<Turno[]> {
    const turnosCollectionRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(
      turnosCollectionRef,
      where('mailEspecialista', '==', mailEspecialista),
      where('estado', '==', "realizado"),
    );

    return from(getDocs(turnosQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as Turno,
          id: doc.id
        })) as Turno[];
      })
    );
  }


  updateTurnoComentarioPaciente(idTurno: string, comentario: string): Observable<void> {
    // Referencia a la colección de comentarios en Firestore
    const comentarioCollectionRef = collection(this.firestore, 'comentarioPaciente');
    
    return new Observable<void>((observer) => {
      // Agrega un nuevo documento en la colección de comentarios
      addDoc(comentarioCollectionRef, { 
        idTurno,         // El ID del turno
        comentario       // El comentario del paciente
      })
      .then(() => {
        observer.next();
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
    });
  }
  saveComentarioPaciente(comentarioPaciente: ComentarioPaciente): Observable<ComentarioPaciente> {
    const comentariosCollectionRef = collection(this.firestore, 'comentarioPaciente');
  
    // Agrega el documento vacío primero
    return from(addDoc(comentariosCollectionRef, {})).pipe(
      switchMap((docRef: DocumentReference<DocumentData>) => {
        // Crea un comentario con el ID obtenido
        const comentarioConId = { ...comentarioPaciente, idComentario: docRef.id };
        // Actualiza el documento con los datos del comentario y el ID
        const comentarioDocRef = doc(this.firestore, `comentarioPaciente/${docRef.id}`);
        return from(updateDoc(comentarioDocRef, comentarioConId)).pipe(
          map(() => comentarioConId)
        );
      })
    );
  } 
  saveHistoriaClinica(historiaClinica: HistoriaClinica): Observable<HistoriaClinica> {
    const historiaClinicaCollectionRef = collection(this.firestore, 'historiaClinica');

    // Agrega el documento vacío primero
    return from(addDoc(historiaClinicaCollectionRef, {})).pipe(
      switchMap((docRef: DocumentReference<DocumentData>) => {
        // Crea un comentario con el ID obtenido
        const historiaClinicaConId = { ...historiaClinica, id: docRef.id };
        // Actualiza el documento con los datos del comentario y el ID
        const historiaClinicaDocRef = doc(this.firestore, `historiaClinica/${docRef.id}`);
        return from(updateDoc(historiaClinicaDocRef, historiaClinicaConId)).pipe(
          map(() => historiaClinicaConId)
        );
      })
    );
  }


  saveCalificacion(calificacion: Calificacion): Observable<Calificacion> {
    const calificacionesCollectionRef = collection(this.firestore, 'calificaciones');
  
    // Agrega el documento vacío primero
    return from(addDoc(calificacionesCollectionRef, {})).pipe(
      switchMap((docRef: DocumentReference<DocumentData>) => {
        // Crea una calificación con el ID obtenido
        const calificacionConId = { ...calificacion, id: docRef.id };
        // Actualiza el documento con los datos de la calificación y el ID
        const calificacionDocRef = doc(this.firestore, `calificaciones/${docRef.id}`);
        return from(updateDoc(calificacionDocRef, calificacionConId)).pipe(
          map(() => calificacionConId)
        );
      })
    );
  }

  getHistoriaClinicaPorPaciente(idPaciente: string): Observable<HistoriaClinica[]> {
    const historiasClinicasCollectionRef = collection(this.firestore, 'historiaClinica');
    const historiasClinicasQuery = query(
      historiasClinicasCollectionRef,
      where('idPaciente', '==', idPaciente)
    );

    return from(getDocs(historiasClinicasQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as HistoriaClinica,
          id: doc.id
        })) as HistoriaClinica[];
      })
    );
  }
  getHistoriaClinicaPorIdTurno(idPaciente: string): Observable<HistoriaClinica | null> {
    const historiasClinicasCollectionRef = collection(this.firestore, 'historiaClinica');
    const historiasClinicasQuery = query(
      historiasClinicasCollectionRef,
      where('idTurno', '==', idPaciente)
    );
  
    return from(getDocs(historiasClinicasQuery)).pipe(
      map(querySnapshot => {
        const doc = querySnapshot.docs[0]; // Tomamos el primer documento
        return doc ? { ...doc.data() as HistoriaClinica, id: doc.id } : null;
      })
    );
  }
  
  getHistoriaClinicaPorTurno(idTurno: string): Observable<HistoriaClinica[]> {
    const historiasClinicasCollectionRef = collection(this.firestore, 'historiaClinica');

    const historiasClinicasQuery = query(
      historiasClinicasCollectionRef,
      where('idTurno', '==', idTurno)
    );

    return from(getDocs(historiasClinicasQuery)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data() as HistoriaClinica,
          id: doc.id
        })) as HistoriaClinica[];
      })
    );
  }

  saveEncuesta(encuesta: CuestionarioPaciente): Observable<CuestionarioPaciente> {
    const encuestasCollectionRef = collection(this.firestore, 'encuestas');

    // Agregar el documento vacío primero
    return from(addDoc(encuestasCollectionRef, {})).pipe(
      switchMap((docRef: DocumentReference<DocumentData>) => {
        // Crea la encuesta con el ID obtenido
        const encuestaConId = { ...encuesta, id: docRef.id };
        // Actualiza el documento con los datos de la encuesta y el ID
        const encuestaDocRef = doc(this.firestore, `encuestas/${docRef.id}`);
        return from(updateDoc(encuestaDocRef, encuestaConId)).pipe(
          map(() => encuestaConId)
        );
      })
    );
  }
  buscarEncuestaPorTurno(idTurno: string): Observable<boolean> {
    const encuestasCollectionRef = collection(this.firestore, 'encuestas');
    const encuestaQuery = query(encuestasCollectionRef, where('idTurno', '==', idTurno));

    return from(getDocs(encuestaQuery)).pipe(
      map(querySnapshot => querySnapshot.size > 0) // Devuelve true si se encuentra al menos una encuesta
    );
  }
}
 