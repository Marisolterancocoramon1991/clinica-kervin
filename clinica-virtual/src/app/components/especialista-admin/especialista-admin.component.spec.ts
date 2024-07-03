import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialistaAdminComponent } from './especialista-admin.component';

describe('EspecialistaAdminComponent', () => {
  let component: EspecialistaAdminComponent;
  let fixture: ComponentFixture<EspecialistaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecialistaAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecialistaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
