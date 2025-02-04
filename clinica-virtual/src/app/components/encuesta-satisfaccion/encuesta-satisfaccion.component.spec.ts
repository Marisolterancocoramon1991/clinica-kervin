import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaSatisfaccionComponent } from './encuesta-satisfaccion.component';

describe('EncuestaSatisfaccionComponent', () => {
  let component: EncuestaSatisfaccionComponent;
  let fixture: ComponentFixture<EncuestaSatisfaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncuestaSatisfaccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncuestaSatisfaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
