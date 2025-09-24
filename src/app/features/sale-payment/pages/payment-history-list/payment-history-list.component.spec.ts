import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistoryListComponent } from './payment-history-list.component';

describe('PaymentHistoryListComponent', () => {
  let component: PaymentHistoryListComponent;
  let fixture: ComponentFixture<PaymentHistoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentHistoryListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
