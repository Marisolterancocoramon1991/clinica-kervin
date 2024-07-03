import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisHorariosEspecialistasComponent } from './mis-horarios-especialistas.component';

describe('MisHorariosEspecialistasComponent', () => {
  let component: MisHorariosEspecialistasComponent;
  let fixture: ComponentFixture<MisHorariosEspecialistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisHorariosEspecialistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisHorariosEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
