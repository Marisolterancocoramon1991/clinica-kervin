import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { patientAuthGuard } from './patient-auth.guard';

describe('patientAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => patientAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
