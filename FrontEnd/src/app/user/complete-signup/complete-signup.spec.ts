import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteSignup } from './complete-signup';

describe('CompleteSignup', () => {
  let component: CompleteSignup;
  let fixture: ComponentFixture<CompleteSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
