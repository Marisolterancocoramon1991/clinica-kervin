import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPacienteComponent } from './menu-paciente.component';

describe('MenuPacienteComponent', () => {
  let component: MenuPacienteComponent;
  let fixture: ComponentFixture<MenuPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
