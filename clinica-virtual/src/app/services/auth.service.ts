import { Injectable } from '@angular/core';
import { Firestore, Timestamp } from '@angular/fire/firestore';
import { addDoc, collection, getDoc, setDoc, getDocs, updateDoc, doc, query, where, DocumentData } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, authState, user, User } from '@angular/fire/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
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
      this.saveUserDataMedico(user, nombre, apellido, password, dni, edad, especialidades, file);
      //this.router.navigate(["/home/login"]);
      Swal.fire({
        icon: 'info',
        title: 'Verificacion de tu Cuenta',
        text: 'La cuenta ha sido registrada con éxito. Por favor, espera la aprobación de nuestro Equipo.',
      });
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
      rol: 'admin',
      profileImage: downloadURL
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.authF, email, password);
      const user = userCredential.user;
      const rol = await this.getUserRoleByUid(user.uid).toPromise();
      switch (rol) {
        case 'paciente':
          await this.signInPaciente(user);
          break;
        case 'medico':
          await this.signInMedico(user);
          break;
        case 'admin':
          this.router.navigate(["/administrador"]);
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
      await signOut(this.authF);
      console.log('Logout successful');
      this.router.navigate(["/home"]);
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrio Un Error intentando Cerrar la Sesion',
      });
      throw error;
    }
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
      this.router.navigate(["/paciente"]);
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
      } else {
        this.router.navigate(["/especialista"]);
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

  
}
