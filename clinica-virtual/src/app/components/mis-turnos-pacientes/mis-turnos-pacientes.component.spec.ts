import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisTurnosPacientesComponent } from './mis-turnos-pacientes.component';

describe('MisTurnosPacientesComponent', () => {
  let component: MisTurnosPacientesComponent;
  let fixture: ComponentFixture<MisTurnosPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisTurnosPacientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisTurnosPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
