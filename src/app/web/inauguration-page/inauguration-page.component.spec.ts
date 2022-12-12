import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InaugurationPageComponent } from './inauguration-page.component';

describe('InaugurationPageComponent', () => {
  let component: InaugurationPageComponent;
  let fixture: ComponentFixture<InaugurationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InaugurationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InaugurationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
