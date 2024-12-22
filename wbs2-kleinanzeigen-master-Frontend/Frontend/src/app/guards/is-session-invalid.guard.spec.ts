import { TestBed } from '@angular/core/testing';

import { IsSessionInvalidGuard } from './is-session-invalid.guard';

describe('IsSessionInvalidGuard', () => {
  let guard: IsSessionInvalidGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsSessionInvalidGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
