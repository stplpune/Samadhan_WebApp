import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostGrievanceComponent } from './post-grievance.component';

describe('PostGrievanceComponent', () => {
  let component: PostGrievanceComponent;
  let fixture: ComponentFixture<PostGrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostGrievanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
