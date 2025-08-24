import { TestBed } from '@angular/core/testing';

import { ONTService } from './ont-service';

describe('ONTService', () => {
  let service: ONTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ONTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
