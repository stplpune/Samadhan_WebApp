import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorReferenceReportComponent } from './collector-reference-report.component';

describe('CollectorReferenceReportComponent', () => {
  let component: CollectorReferenceReportComponent;
  let fixture: ComponentFixture<CollectorReferenceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectorReferenceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorReferenceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
