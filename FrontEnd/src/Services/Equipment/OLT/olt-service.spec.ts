import { TestBed } from '@angular/core/testing';

import { OLTService } from './olt-service';

describe('OLTService', () => {
  let service: OLTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OLTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
