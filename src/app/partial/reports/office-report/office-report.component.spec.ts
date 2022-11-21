import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeReportComponent } from './office-report.component';

describe('OfficeReportComponent', () => {
  let component: OfficeReportComponent;
  let fixture: ComponentFixture<OfficeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
