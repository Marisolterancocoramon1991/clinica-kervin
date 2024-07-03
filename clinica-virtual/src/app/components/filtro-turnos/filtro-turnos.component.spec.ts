import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroTurnosComponent } from './filtro-turnos.component';

describe('FiltroTurnosComponent', () => {
  let component: FiltroTurnosComponent;
  let fixture: ComponentFixture<FiltroTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroTurnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
