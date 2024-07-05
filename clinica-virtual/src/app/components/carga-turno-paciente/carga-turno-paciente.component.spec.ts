import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaTurnoPacienteComponent } from './carga-turno-paciente.component';

describe('CargaTurnoPacienteComponent', () => {
  let component: CargaTurnoPacienteComponent;
  let fixture: ComponentFixture<CargaTurnoPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaTurnoPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaTurnoPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
