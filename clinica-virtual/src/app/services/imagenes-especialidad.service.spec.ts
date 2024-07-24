import { TestBed } from '@angular/core/testing';

import { ImagenesEspecialidadService } from './imagenes-especialidad.service';

describe('ImagenesEspecialidadService', () => {
  let service: ImagenesEspecialidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagenesEspecialidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
