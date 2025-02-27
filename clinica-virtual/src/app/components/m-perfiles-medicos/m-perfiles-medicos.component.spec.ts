import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MPerfilesMedicosComponent } from './m-perfiles-medicos.component';

describe('MPerfilesMedicosComponent', () => {
  let component: MPerfilesMedicosComponent;
  let fixture: ComponentFixture<MPerfilesMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MPerfilesMedicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MPerfilesMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
