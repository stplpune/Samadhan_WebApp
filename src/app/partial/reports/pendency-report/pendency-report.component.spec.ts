import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendencyReportComponent } from './pendency-report.component';

describe('PendencyReportComponent', () => {
  let component: PendencyReportComponent;
  let fixture: ComponentFixture<PendencyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendencyReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendencyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
