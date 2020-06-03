import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineCourseOverviewComponent } from './online-course-overview.component';

describe('OnlineCourseOverviewComponent', () => {
  let component: OnlineCourseOverviewComponent;
  let fixture: ComponentFixture<OnlineCourseOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineCourseOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineCourseOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
