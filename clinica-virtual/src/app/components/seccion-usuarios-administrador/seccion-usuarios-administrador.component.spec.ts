import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionUsuariosAdministradorComponent } from './seccion-usuarios-administrador.component';

describe('SeccionUsuariosAdministradorComponent', () => {
  let component: SeccionUsuariosAdministradorComponent;
  let fixture: ComponentFixture<SeccionUsuariosAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionUsuariosAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionUsuariosAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
