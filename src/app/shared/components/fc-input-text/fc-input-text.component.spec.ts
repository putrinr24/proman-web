import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcInputTextComponent } from './fc-input-text.component';

describe('FcInputTextComponent', () => {
  let component: FcInputTextComponent;
  let fixture: ComponentFixture<FcInputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcInputTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
