import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatisfiedReportComponent } from './satisfied-report.component';

describe('SatisfiedReportComponent', () => {
  let component: SatisfiedReportComponent;
  let fixture: ComponentFixture<SatisfiedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SatisfiedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SatisfiedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
