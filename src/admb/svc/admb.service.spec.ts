import { TestBed } from '@angular/core/testing';

import { AdmbService } from './admb.service';

describe('AppdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdmbService = TestBed.get(AdmbService);
    expect(service).toBeTruthy();
  });
});
