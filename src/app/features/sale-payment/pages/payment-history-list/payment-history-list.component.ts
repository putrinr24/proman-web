import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { SalePayment } from '@features/sale-payment/interfaces/sale-payment.interfaces';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '@shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payment-history-list',
  imports: [
    FontAwesomeModule,
    SharedModule,
    CommonModule,
    TooltipModule,
    RouterModule,
  ],
  templateUrl: './payment-history-list.component.html',
  styleUrl: './payment-history-list.component.css',
  standalone: true,
})
export class PaymentHistoryListComponent {
  private readonly destroy$ = new Subject<void>();

  @Input() saleInvoiceId!: string;
  @Input() salePayments: SalePayment[] = [];
  loading: boolean = false;
  authUser: any;

  // actionButtons: any[] = [
  //   {
  //     id: 1,
  //     label: 'Refresh',
  //     icon: './assets/images/icons/refresh.svg',
  //     action: () => {
  //       this.triggerParentRefresh();
  //     },
  //   },
  // ];
  // @Output() refreshParent = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.saleInvoiceId = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.authService.getCurrentUserData.subscribe((user) => {
      if (user) {
        this.authUser = user;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToDetail(salePayment: SalePayment) {
    this.router.navigate(['/sale-payment/view/', salePayment.id]);
  }

  //   triggerParentRefresh() {
  //   this.refreshParent.emit();
  // }
}
