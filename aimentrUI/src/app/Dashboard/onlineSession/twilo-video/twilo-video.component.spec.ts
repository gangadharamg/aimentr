import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwiloVideoComponent } from './twilo-video.component';

describe('TwiloVideoComponent', () => {
  let component: TwiloVideoComponent;
  let fixture: ComponentFixture<TwiloVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwiloVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwiloVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
