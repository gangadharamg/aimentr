import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorFollowersComponent } from './mentor-followers.component';

describe('MentorFollowersComponent', () => {
  let component: MentorFollowersComponent;
  let fixture: ComponentFixture<MentorFollowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorFollowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorFollowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
