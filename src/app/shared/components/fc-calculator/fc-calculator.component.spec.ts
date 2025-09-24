import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcCalculatorComponent } from './fc-calculator.component';

describe('FcCalculatorComponent', () => {
  let component: FcCalculatorComponent;
  let fixture: ComponentFixture<FcCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
