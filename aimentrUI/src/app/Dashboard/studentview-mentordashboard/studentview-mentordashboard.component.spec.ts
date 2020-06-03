import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentviewMentordashboardComponent } from './studentview-mentordashboard.component';

describe('StudentviewMentordashboardComponent', () => {
  let component: StudentviewMentordashboardComponent;
  let fixture: ComponentFixture<StudentviewMentordashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentviewMentordashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentviewMentordashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
