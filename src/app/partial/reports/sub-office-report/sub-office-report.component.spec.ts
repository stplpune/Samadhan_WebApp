import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubOfficeReportComponent } from './sub-office-report.component';

describe('SubOfficeReportComponent', () => {
  let component: SubOfficeReportComponent;
  let fixture: ComponentFixture<SubOfficeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubOfficeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubOfficeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
