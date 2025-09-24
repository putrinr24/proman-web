import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PureAbility } from '@casl/ability';
import { SalePayment } from '@features/sale-payment/interfaces/sale-payment.interfaces';
import { SalePaymentService } from '@features/sale-payment/services/sale-payment.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { FcCurrencyPipe } from '@shared/pipes/fc-currency.pipe';
import { SharedModule } from '@shared/shared.module';
import { DialogService } from 'primeng/dynamicdialog';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sale-payment-view',
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CommonModule,
    TooltipModule,
    TabsModule,
    RouterModule,
  ],
  templateUrl: './sale-payment-view.component.html',
  styleUrl: './sale-payment-view.component.css',
  providers: [DialogService, FcCurrencyPipe],
})
export class SalePaymentViewComponent {
  private readonly destroy$ = new Subject<void>();

  actionButtons: any[] = [
    {
      id: 1,
      label: 'Refresh',
      icon: '/images/icons/refresh.svg',
      action: () => {
        this.loadData();
      },
    },
  ];

  statusButtons: any[] = [
    {
      id: 1,
      label: 'Approve',
      icon: '/images/icons/check-square.svg',
      action: () => {
        this.approve();
      },
      hidden: true,
    },
    {
      id: 2,
      label: 'Reject',
      icon: '/images/icons/times-square.svg',
      action: () => {
        this.cancel();
      },
      hidden: true,
    },
    {
      id: 3,
      label: 'Delete',
      icon: '/images/icons/trash-bin.svg',
      action: () => {
        this.delete();
      },
      hidden: true,
    },
  ];

  salePayment: SalePayment = {} as SalePayment;
  loading: boolean = false;

  @Output() onDeleted = new EventEmitter();
  @Output() onUpdated = new EventEmitter();

  constructor(
    private salePaymentService: SalePaymentService,
    private fcToastService: FcToastService,
    private fcConfirmService: FcConfirmService,
    private location: Location,
    private route: ActivatedRoute,
    private ability: PureAbility
  ) {
    this.salePayment.id = String(this.route.snapshot.paramMap.get('id'));

    this.statusButtons[0].hidden = !this.ability.can('approve', 'sale-payment');
    this.statusButtons[1].hidden = !this.ability.can('cancel', 'sale-payment');
    this.statusButtons[2].hidden = !this.ability.can('delete', 'sale-payment');
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateStatusButtons() {
    this.statusButtons.forEach((btn) => (btn.hidden = true));

    if (this.salePayment.status === 0) {
      this.statusButtons[0].hidden = false; // Approved
      this.statusButtons[1].hidden = false; // Cancelled
      this.statusButtons[2].hidden = false; // Delete
    }
  }

  loadData() {
    this.loading = true;
    this.destroy$.next();

    this.salePaymentService
      .getSalePayment(this.salePayment.id)
      .subscribe((res: any) => {
        this.loading = false;
        this.salePayment = res.data;

        this.salePayment.status = Number(this.salePayment.status);
        this.generateStatusButtons();
      });
  }

  approve() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are You sure to approve this payment?',

      accept: () => {
        this.salePaymentService
          .approveSalePayment(this.salePayment.id)
          .subscribe({
            next: (res: any) => {
              this.salePayment.status = res.data.status;
              this.salePayment.status_label = res.data.status_label;
              this.fcToastService.add({
                severity: 'success',
                header: 'Success',
                message: 'Sale Payment has been approved',
              });
              this.generateStatusButtons();
            },
            error: (err: any) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error',
                message: err.message,
              });
            },
          });
      },
    });
  }

  cancel() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to cancel this payment?',
      accept: () => {
        this.salePaymentService
          .cancelSalePayment(this.salePayment.id)
          .subscribe({
            next: (res: any) => {
              this.salePayment.status = res.data.status;
              this.salePayment.status_label = res.data.status_label;
              this.fcToastService.add({
                severity: 'success',
                header: 'Success',
                message: 'Sale Payment has been cancelled',
              });
              this.generateStatusButtons();
            },
            error: (err: any) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error',
                message: err.message,
              });
            },
          });
      },
    });
  }

  delete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.salePaymentService
          .deleteSalePayment(this.salePayment.id)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Success ',
                message: 'Sale Payment has been deleted',
              });
              this.location.back();
            },
            error: (err: any) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error',
                message: err.message,
              });
            },
          });
      },
    });
  }

  back() {
    this.location.back();
  }
}
