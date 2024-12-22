import { TestBed } from '@angular/core/testing';

import { NutzertypGuard } from './nutzertyp.guard';

describe('NutzertypGuard', () => {
  let guard: NutzertypGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NutzertypGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
