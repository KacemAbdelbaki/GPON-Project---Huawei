import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBox } from './create-box';

describe('CreateBox', () => {
  let component: CreateBox;
  let fixture: ComponentFixture<CreateBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
