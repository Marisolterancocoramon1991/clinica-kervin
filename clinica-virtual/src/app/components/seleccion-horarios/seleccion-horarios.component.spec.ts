import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionHorariosComponent } from './seleccion-horarios.component';

describe('SeleccionHorariosComponent', () => {
  let component: SeleccionHorariosComponent;
  let fixture: ComponentFixture<SeleccionHorariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionHorariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
