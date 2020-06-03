import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeTerminalLayoutComponent } from './code-terminal-layout.component';

describe('CodeTerminalLayoutComponent', () => {
  let component: CodeTerminalLayoutComponent;
  let fixture: ComponentFixture<CodeTerminalLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeTerminalLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeTerminalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
