import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyStandardComponent } from './safety-standard.component';

describe('SafetyStandardComponent', () => {
  let component: SafetyStandardComponent;
  let fixture: ComponentFixture<SafetyStandardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafetyStandardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafetyStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
