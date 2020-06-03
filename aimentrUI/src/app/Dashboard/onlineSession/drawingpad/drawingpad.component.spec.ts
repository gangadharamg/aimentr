import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingpadComponent } from './drawingpad.component';

describe('DrawingpadComponent', () => {
  let component: DrawingpadComponent;
  let fixture: ComponentFixture<DrawingpadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingpadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
