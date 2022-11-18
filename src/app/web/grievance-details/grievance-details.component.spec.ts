import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceDetailsComponent } from './grievance-details.component';

describe('GrievanceDetailsComponent', () => {
  let component: GrievanceDetailsComponent;
  let fixture: ComponentFixture<GrievanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
