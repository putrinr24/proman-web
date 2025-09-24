import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleInvoiceViewComponent } from './sale-invoice-view.component';

describe('SaleInvoiceViewComponent', () => {
  let component: SaleInvoiceViewComponent;
  let fixture: ComponentFixture<SaleInvoiceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleInvoiceViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleInvoiceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
