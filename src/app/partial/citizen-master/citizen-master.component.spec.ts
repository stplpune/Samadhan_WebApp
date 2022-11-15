import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenMasterComponent } from './citizen-master.component';

describe('CitizenMasterComponent', () => {
  let component: CitizenMasterComponent;
  let fixture: ComponentFixture<CitizenMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitizenMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitizenMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
