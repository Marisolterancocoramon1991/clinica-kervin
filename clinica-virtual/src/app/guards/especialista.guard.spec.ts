import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { especialistaGuard } from './especialista.guard';

describe('especialistaGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => especialistaGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
