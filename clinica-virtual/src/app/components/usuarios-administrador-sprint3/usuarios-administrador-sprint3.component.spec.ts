import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosAdministradorSprint3Component } from './usuarios-administrador-sprint3.component';

describe('UsuariosAdministradorSprint3Component', () => {
  let component: UsuariosAdministradorSprint3Component;
  let fixture: ComponentFixture<UsuariosAdministradorSprint3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosAdministradorSprint3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosAdministradorSprint3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
