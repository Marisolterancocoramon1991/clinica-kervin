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
        component: RegistrarAdminComponent
    },
    {
        path: 'registrar/admin/menu',
        component: MenuAdminComponent
    },
    {
        path: 'registrar/admin/esoecialistaAdmin',
        component: EspecialistaAdminComponent
       // canActivate: [adminGuard]
    },
    {
        path: 'registrar/paciente/miturnos',
        component: MisTurnosPacientesComponent,
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
        path: 'paciente/formulario',
        component: SolicitudTurnoComponent
      // canActivate: [patientAuthGuard]
    },
    {
        path: 'medico/miperfil',
        component: MiPerfilComponent
      // canActivate: [patientAuthGuard]
    },
    

    {
        path: '**',
        component: BienvenidaComponent
    },
];
