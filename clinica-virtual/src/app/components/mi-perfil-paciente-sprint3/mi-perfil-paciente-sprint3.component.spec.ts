import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiPerfilPacienteSprint3Component } from './mi-perfil-paciente-sprint3.component';

describe('MiPerfilPacienteSprint3Component', () => {
  let component: MiPerfilPacienteSprint3Component;
  let fixture: ComponentFixture<MiPerfilPacienteSprint3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiPerfilPacienteSprint3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiPerfilPacienteSprint3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
