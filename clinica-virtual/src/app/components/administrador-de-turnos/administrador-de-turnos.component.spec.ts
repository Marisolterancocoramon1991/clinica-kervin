import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorDeTurnosComponent } from './administrador-de-turnos.component';

describe('AdministradorDeTurnosComponent', () => {
  let component: AdministradorDeTurnosComponent;
  let fixture: ComponentFixture<AdministradorDeTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorDeTurnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministradorDeTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
