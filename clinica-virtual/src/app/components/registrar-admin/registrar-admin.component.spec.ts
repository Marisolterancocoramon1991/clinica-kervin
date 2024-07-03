import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarAdminComponent } from './registrar-admin.component';

describe('RegistrarAdminComponent', () => {
  let component: RegistrarAdminComponent;
  let fixture: ComponentFixture<RegistrarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
