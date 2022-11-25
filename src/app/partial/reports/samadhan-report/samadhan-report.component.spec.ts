import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamadhanReportComponent } from './samadhan-report.component';

describe('SamadhanReportComponent', () => {
  let component: SamadhanReportComponent;
  let fixture: ComponentFixture<SamadhanReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamadhanReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamadhanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
