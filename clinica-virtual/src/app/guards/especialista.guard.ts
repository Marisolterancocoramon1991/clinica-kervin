import { CanActivateFn} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { map, tap, switchMap} from 'rxjs/operators';
import { Observable,of } from 'rxjs';

export const especialistaGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    switchMap(user => {
      if (user) {
        return authService.isUserSpecialist(user.uid).pipe(
          map(ismedico => {
            if (ismedico) {
              return true;
            } else {
              router.navigate(['/**']); // Redirect if not admin
              return false;
            }
          })
        );
      } else {
        router.navigate(['/**']); // Redirect to login if not authenticated
        return of(false);
      }
    })
  );
};
