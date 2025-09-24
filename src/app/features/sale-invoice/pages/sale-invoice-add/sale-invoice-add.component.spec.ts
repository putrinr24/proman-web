import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleInvoiceAddComponent } from './sale-invoice-add.component';

describe('SaleInvoiceAddComponent', () => {
  let component: SaleInvoiceAddComponent;
  let fixture: ComponentFixture<SaleInvoiceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleInvoiceAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleInvoiceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
