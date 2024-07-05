import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoAdministradorComponent } from './turno-administrador.component';

describe('TurnoAdministradorComponent', () => {
  let component: TurnoAdministradorComponent;
  let fixture: ComponentFixture<TurnoAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
