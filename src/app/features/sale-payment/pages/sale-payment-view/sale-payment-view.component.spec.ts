import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePaymentViewComponent } from './sale-payment-view.component';

describe('SalePaymentViewComponent', () => {
  let component: SalePaymentViewComponent;
  let fixture: ComponentFixture<SalePaymentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalePaymentViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalePaymentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
