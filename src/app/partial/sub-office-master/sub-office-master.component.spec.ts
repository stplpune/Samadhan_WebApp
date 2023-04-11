import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubOfficeMasterComponent } from './sub-office-master.component';

describe('SubOfficeMasterComponent', () => {
  let component: SubOfficeMasterComponent;
  let fixture: ComponentFixture<SubOfficeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubOfficeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubOfficeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
