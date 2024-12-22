import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetUsernameComponent } from './reset-username.component';

describe('ResetUsernameComponent', () => {
  let component: ResetUsernameComponent;
  let fixture: ComponentFixture<ResetUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetUsernameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
