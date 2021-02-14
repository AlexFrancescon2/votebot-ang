import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareQuestionsComponent } from './prepare-questions.component';

describe('PrepareQuestionsComponent', () => {
  let component: PrepareQuestionsComponent;
  let fixture: ComponentFixture<PrepareQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepareQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
