import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteEspecialistaSprint3Component } from './paciente-especialista-sprint3.component';

describe('PacienteEspecialistaSprint3Component', () => {
  let component: PacienteEspecialistaSprint3Component;
  let fixture: ComponentFixture<PacienteEspecialistaSprint3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteEspecialistaSprint3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteEspecialistaSprint3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
