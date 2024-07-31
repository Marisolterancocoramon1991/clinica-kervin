import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaImpresionEspecialistaComponent } from './lista-impresion-especialista.component';

describe('ListaImpresionEspecialistaComponent', () => {
  let component: ListaImpresionEspecialistaComponent;
  let fixture: ComponentFixture<ListaImpresionEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaImpresionEspecialistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaImpresionEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
