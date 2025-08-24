import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOLT } from './create-olt';

describe('CreateOLT', () => {
  let component: CreateOLT;
  let fixture: ComponentFixture<CreateOLT>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOLT]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOLT);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
