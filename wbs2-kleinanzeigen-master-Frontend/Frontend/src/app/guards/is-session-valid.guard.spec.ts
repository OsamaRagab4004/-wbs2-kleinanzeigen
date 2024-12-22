import { TestBed } from '@angular/core/testing';

import { IsSessionValidGuard } from './is-session-valid.guard';

describe('IsSessionValidGuard', () => {
  let guard: IsSessionValidGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsSessionValidGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
