import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVerifycationComponent } from './otp-verifycation.component';

describe('OtpVerifycationComponent', () => {
  let component: OtpVerifycationComponent;
  let fixture: ComponentFixture<OtpVerifycationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpVerifycationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpVerifycationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
