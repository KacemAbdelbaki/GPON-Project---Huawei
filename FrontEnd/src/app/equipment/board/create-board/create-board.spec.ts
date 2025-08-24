import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBoard } from './create-board';

describe('CreateBoard', () => {
  let component: CreateBoard;
  let fixture: ComponentFixture<CreateBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
