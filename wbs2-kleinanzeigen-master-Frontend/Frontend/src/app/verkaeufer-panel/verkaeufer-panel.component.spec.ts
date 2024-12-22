import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerkaeuferPanelComponent } from './verkaeufer-panel.component';

describe('VerkaeuferPanelComponent', () => {
  let component: VerkaeuferPanelComponent;
  let fixture: ComponentFixture<VerkaeuferPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerkaeuferPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerkaeuferPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
