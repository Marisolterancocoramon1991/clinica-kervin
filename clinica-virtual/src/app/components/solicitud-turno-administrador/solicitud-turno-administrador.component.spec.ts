import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudTurnoAdministradorComponent } from './solicitud-turno-administrador.component';

describe('SolicitudTurnoAdministradorComponent', () => {
  let component: SolicitudTurnoAdministradorComponent;
  let fixture: ComponentFixture<SolicitudTurnoAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudTurnoAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudTurnoAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
