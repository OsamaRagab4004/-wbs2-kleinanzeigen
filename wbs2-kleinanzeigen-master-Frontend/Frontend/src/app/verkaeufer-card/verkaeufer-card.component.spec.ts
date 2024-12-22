import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerkaeuferCardComponent } from './verkaeufer-card.component';

describe('VerkaeuferCardComponent', () => {
  let component: VerkaeuferCardComponent;
  let fixture: ComponentFixture<VerkaeuferCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerkaeuferCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerkaeuferCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
