import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsReportForAndroidComponent } from './details-report-for-android.component';

describe('DetailsReportForAndroidComponent', () => {
  let component: DetailsReportForAndroidComponent;
  let fixture: ComponentFixture<DetailsReportForAndroidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsReportForAndroidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsReportForAndroidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
