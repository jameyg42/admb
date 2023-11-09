import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeygenPanelComponent } from './keygen-panel.component';

describe('KeygenPanelComponent', () => {
  let component: KeygenPanelComponent;
  let fixture: ComponentFixture<KeygenPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeygenPanelComponent]
    });
    fixture = TestBed.createComponent(KeygenPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
