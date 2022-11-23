import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDownloadForAndroidComponent } from './document-download-for-android.component';

describe('DocumentDownloadForAndroidComponent', () => {
  let component: DocumentDownloadForAndroidComponent;
  let fixture: ComponentFixture<DocumentDownloadForAndroidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentDownloadForAndroidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentDownloadForAndroidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
