import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorshipRegistrationComponent } from './mentorship-registration.component';

describe('MentorshipRegistrationComponent', () => {
  let component: MentorshipRegistrationComponent;
  let fixture: ComponentFixture<MentorshipRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorshipRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorshipRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
