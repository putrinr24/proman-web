import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePaymentListComponent } from './sale-payment-list.component';

describe('SalePaymentListComponent', () => {
  let component: SalePaymentListComponent;
  let fixture: ComponentFixture<SalePaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalePaymentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalePaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
