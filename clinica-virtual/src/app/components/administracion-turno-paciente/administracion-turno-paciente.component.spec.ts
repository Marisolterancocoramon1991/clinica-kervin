import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionTurnoPacienteComponent } from './administracion-turno-paciente.component';

describe('AdministracionTurnoPacienteComponent', () => {
  let component: AdministracionTurnoPacienteComponent;
  let fixture: ComponentFixture<AdministracionTurnoPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministracionTurnoPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministracionTurnoPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
