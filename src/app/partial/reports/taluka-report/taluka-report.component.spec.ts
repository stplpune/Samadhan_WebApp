import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalukaReportComponent } from './taluka-report.component';

describe('TalukaReportComponent', () => {
  let component: TalukaReportComponent;
  let fixture: ComponentFixture<TalukaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalukaReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalukaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
