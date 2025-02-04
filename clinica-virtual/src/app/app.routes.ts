import { Routes } from '@angular/router';

//comoponentes
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrarPacienteComponent } from './components/registrar-paciente/registrar-paciente.component';
import { RegistrarMedicoComponent } from './components/registrar-medico/registrar-medico.component';
import { RegistrarAdminComponent } from './components/registrar-admin/registrar-admin.component';
import { MenuAdminComponent } from './components/menu-admin/menu-admin.component';

//guards
import { adminGuard } from './guards/admin.guard';
import { patientAuthGuard } from './guards/patient-auth.guard';
import { EspecialistaAdminComponent } from './components/especialista-admin/especialista-admin.component';
import { MisTurnosPacientesComponent } from './components/mis-turnos-pacientes/mis-turnos-pacientes.component';
import { FiltroTurnosComponent } from './components/filtro-turnos/filtro-turnos.component';
import { CargaTurnoPacienteComponent } from './components/carga-turno-paciente/carga-turno-paciente.component';
import { RecaptchaComponent } from 'ng-recaptcha';
import { CasaComponent } from './components/casa/casa.component';
import { SolicitudTurnoComponent } from './components/solicitud-turno/solicitud-turno.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { CabeceraComponent } from './components/cabecera/cabecera.component';
import { ListaPacienteComponent } from './components/lista-paciente/lista-paciente.component';
import { SolicitudTurnoAdministradorComponent } from './components/solicitud-turno-administrador/solicitud-turno-administrador.component';
import { especialistaGuard } from './guards/especialista.guard';
import { MenuEspecialistaComponent } from './components/menu-especialista/menu-especialista.component';
import { AdministradorDeTurnosComponent } from './components/administrador-de-turnos/administrador-de-turnos.component';
import { AdministradorEspecialistaTurnoComponent } from './components/administrador-especialista-turno/administrador-especialista-turno.component';
import { AdministracionTurnoPacienteComponent } from './components/administracion-turno-paciente/administracion-turno-paciente.component';
import { MenuPacienteComponent } from './components/menu-paciente/menu-paciente.component';
import { PacienteEspecialistaSprint3Component } from './components/paciente-especialista-sprint3/paciente-especialista-sprint3.component';
import { ListaImpresionEspecialistaComponent } from './components/lista-impresion-especialista/lista-impresion-especialista.component';
import { SeccionUsuariosAdministradorComponent } from './components/seccion-usuarios-administrador/seccion-usuarios-administrador.component';
import { MiPerfilPacienteSprint3Component } from './components/mi-perfil-paciente-sprint3/mi-perfil-paciente-sprint3.component';
import { GraficosComponent } from './components/graficos/graficos.component';
import { EncuestaSatisfaccionComponent } from './components/encuesta-satisfaccion/encuesta-satisfaccion.component';
import { GraficosDosComponent } from './components/graficos-dos/graficos-dos.component';

export const routes: Routes = [
   
    {
       path: 'bienvenida',
      component: BienvenidaComponent
    },
    {
        path: 'registrar',
        component: RegistrarComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'registrar/paciente',
        component: RegistrarPacienteComponent
    },
    {
        path: 'registrar/medico',
        component: RegistrarMedicoComponent
    },
    {
        path: 'registrar/admin',
        component: RegistrarAdminComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'registrar/admin/menu',
        component: MenuAdminComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'registrar/admin/especialistaAdmin',
        component: EspecialistaAdminComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'registrar/paciente/miturnos',
        component: MisTurnosPacientesComponent,
       canActivate: [patientAuthGuard]
    },
    {
        path: 'menu/paciente',
        component: MenuPacienteComponent,
       canActivate: [patientAuthGuard]
    },
    {  
        path: 'registrar/paciente/formulario',
        component: CargaTurnoPacienteComponent,
       canActivate: [patientAuthGuard]
    },
    {
        path: 'filtro',
        component: FiltroTurnosComponent
      // canActivate: [patientAuthGuard]
    },
    {
        path: 'recaptcha',
        component: CasaComponent
      // canActivate: [patientAuthGuard]
    },
    {
        path: 'medico/llenarHistoriaClinica',
        component: PacienteEspecialistaSprint3Component,
        canActivate: [especialistaGuard]
      // canActivate: [patientAuthGuard]
    },
    {
        path: 'admin/seccionusuario',
        component: SeccionUsuariosAdministradorComponent,
        canActivate: [adminGuard]
    },
    {//
        path: 'medico/listar/paciente/historialclinico',
        component: ListaImpresionEspecialistaComponent,
        canActivate: [especialistaGuard]
        // canActivate: [patientAuthGuard]
    },
    {
        path: 'paciente/formulario',
        component: SolicitudTurnoComponent,
        canActivate: [patientAuthGuard]
    },
    { 
        path: 'paciente/impresion/busqueda/pdf',
        component: MiPerfilPacienteSprint3Component,
        canActivate: [patientAuthGuard]
    },
    {
        path: 'paciente/formulario/administracion',
        component: AdministracionTurnoPacienteComponent,
        canActivate: [patientAuthGuard]
    },
    { 
        path: 'medico/miperfil',
        component: MiPerfilComponent,
        canActivate: [especialistaGuard]
      
    },
    { 
        path: 'medico/menu',
        component: MenuEspecialistaComponent,
        canActivate: [especialistaGuard]
      
    },
    { 
        path: 'medico/menu/administracionturno',
        component: AdministradorEspecialistaTurnoComponent,
        canActivate: [especialistaGuard]
      
    },
    { 
        path: 'administrador/turnos',
        component: AdministradorDeTurnosComponent,
       // canActivate: [especialistaGuard]
       canActivate: [adminGuard]
      
    },
    {
        path: 'listadopaciente',
        component: ListaPacienteComponent

    },
    { 
        path: 'cabecera',
        component: CabeceraComponent
      // canActivate: [patientAuthGuard]
    },
    {
        path: 'administrador/solicitud',
        component: SolicitudTurnoAdministradorComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'admin/grafico',
        component: GraficosComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'admin/grafico/segunda',
        component: GraficosDosComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'paciente/cuestionario',
        component: EncuestaSatisfaccionComponent,
        canActivate: [patientAuthGuard]
    },
    {
        path: '**',
        component: BienvenidaComponent
    },
    

];
