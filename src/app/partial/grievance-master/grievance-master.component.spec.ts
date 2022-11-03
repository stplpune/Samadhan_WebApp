import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceMasterComponent } from './grievance-master.component';

describe('GrievanceMasterComponent', () => {
  let component: GrievanceMasterComponent;
  let fixture: ComponentFixture<GrievanceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
