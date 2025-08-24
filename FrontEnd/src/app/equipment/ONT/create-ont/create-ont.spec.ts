import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateONT } from './create-ont';

describe('CreateONT', () => {
  let component: CreateONT;
  let fixture: ComponentFixture<CreateONT>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateONT]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateONT);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
