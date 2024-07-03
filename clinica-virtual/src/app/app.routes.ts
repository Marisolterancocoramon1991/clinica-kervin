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
import { EspecialistaAdminComponent } from './components/especialista-admin/especialista-admin.component';

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
        component: MenuAdminComponent,
    },
    {
        path: 'registrar/admin/esoecialistaAdmin',
        component: EspecialistaAdminComponent,
        //canActivate: [adminGuard]
    },
    {
        path: '**',
        component: BienvenidaComponent
    },
];
