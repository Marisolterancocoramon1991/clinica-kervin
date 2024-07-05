import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudTurnoComponent } from './solicitud-turno.component';

describe('SolicitudTurnoComponent', () => {
  let component: SolicitudTurnoComponent;
  let fixture: ComponentFixture<SolicitudTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudTurnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
