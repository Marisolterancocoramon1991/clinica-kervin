import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

export const roleBasedRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    switchMap(user => {
      if (user) {
        return authService.getUserRoleByUid(user.uid).pipe(
          map(role => {
            switch (role) {
              case 'paciente':
                router.navigate(['/menu/paciente']);
                return true;
                break;
              case 'medico':
                router.navigate(['/medico/menu']);
                return true;
                break;
              case 'admin':
                router.navigate(['/registrar/admin/menu']);
                return true;
                break;
              default:
                router.navigate(['/**']); // En caso de rol no reconocido
                return false; // Impide la activación de la ruta solicitada
            }
            
          })
        );
      } else {
        router.navigate(['/**']);
        return of(false);
      }
    })
  );
};
