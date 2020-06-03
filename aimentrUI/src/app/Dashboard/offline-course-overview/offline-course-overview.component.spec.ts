import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineCourseOverviewComponent } from './offline-course-overview.component';

describe('OfflineCourseOverviewComponent', () => {
  let component: OfflineCourseOverviewComponent;
  let fixture: ComponentFixture<OfflineCourseOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineCourseOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineCourseOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
