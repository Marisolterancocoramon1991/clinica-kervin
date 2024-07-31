import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorEspecialistaTurnoComponent } from './administrador-especialista-turno.component';

describe('AdministradorEspecialistaTurnoComponent', () => {
  let component: AdministradorEspecialistaTurnoComponent;
  let fixture: ComponentFixture<AdministradorEspecialistaTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorEspecialistaTurnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministradorEspecialistaTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
