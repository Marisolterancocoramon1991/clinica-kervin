import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarMedicoComponent } from './registrar-medico.component';

describe('RegistrarMedicoComponent', () => {
  let component: RegistrarMedicoComponent;
  let fixture: ComponentFixture<RegistrarMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarMedicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
