import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisTurnosEspecialistasComponent } from './mis-turnos-especialistas.component';

describe('MisTurnosEspecialistasComponent', () => {
  let component: MisTurnosEspecialistasComponent;
  let fixture: ComponentFixture<MisTurnosEspecialistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisTurnosEspecialistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisTurnosEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
