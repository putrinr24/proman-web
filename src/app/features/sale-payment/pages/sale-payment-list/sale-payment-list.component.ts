import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { User } from '@features/user/interfaces/user';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { Subject, take, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SalePaymentService } from '@features/sale-payment/services/sale-payment.service';
import { SalePayment } from '@features/sale-payment/interfaces/sale-payment.interfaces';
import { DialogService } from 'primeng/dynamicdialog';
import { FcCurrencyPipe } from '@shared/pipes/fc-currency.pipe';

@Component({
  selector: 'app-sale-payment-list',
  imports: [
    CommonModule,
    SharedModule,
    TooltipModule,
    FontAwesomeModule,
    ButtonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './sale-payment-list.component.html',
  styleUrl: './sale-payment-list.component.css',
  providers: [DialogService, FcCurrencyPipe],
})
export class SalePaymentListComponent {
  private readonly destroy$ = new Subject<void>();

  faSearch = faSearch;
  loading: boolean = false;

  authUser: User = {} as User;
  users: User[] = [];
  salePayments: SalePayment[] = [];
  userRoleEnum = UserRoleEnum;

  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  searchQuery: string = '';

  actionButtons: any[] = [
    {
      id: 1,
      label: 'Refresh',
      icon: './assets/images/icons/refresh.svg',
      styleClass: 'border border-gray-400',
      active: false,
      action: () => {
        this.loadData();
      },
    },
  ];

  fcFilterConfig: FcFilterConfig = {
    filterFields: [
      {
        name: 'role',
        value: null,
      },
    ],
    sort: {
      fields: [{ name: 'name', header: 'Name' }],
      selectedField: 'id',
      direction: 'desc',
    },
  };

  constructor(
    private layoutService: LayoutService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private authService: AuthService,
    private salePaymentService: SalePaymentService,
    private fcCurrencyPipe: FcCurrencyPipe
  ) {
    this.authUser = this.authService.getCurrentUserData.value;
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.page = params.page ? params.page : 1;
        this.rows = params.limit ? params.limit : 10;
        this.searchQuery = params.q ? params.q : '';

        if (params.order_by && params.direction) {
          this.fcFilterConfig.sort.selectedField = params.order_by;
          this.fcFilterConfig.sort.direction = params.direction;
        }
        this.fcFilterConfig.filterFields?.map((field: any) => {
          if (params[field.name]) {
            field.value = String(params[field.name]);
            if (field.type == 'object') {
              field.valueLabel = String(params[field.name + '-label']);
            }
          }
        });
        this.fcFilterConfig.filterOptions?.map((filterOption: any) => {
          if (params[filterOption.optionValue]) {
            filterOption.selectedValue = String(
              params[filterOption.optionValue]
            );
          }
        });
      });
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setParam() {
    let queryParams: any = {
      page: this.page,
      limit: this.rows,
    };
    if (this.searchQuery) {
      queryParams.q = this.searchQuery;
    }
    if (this.fcFilterConfig.sort.selectedField) {
      queryParams.order_by = this.fcFilterConfig.sort.selectedField;
      queryParams.direction = this.fcFilterConfig.sort.direction;
    }

    // filter conditions
    this.fcFilterConfig.filterFields?.map((field: any) => {
      if (field.value) {
        queryParams[field.name] = field.value;
      }
    });
    this.fcFilterConfig.filterOptions?.map((filterOption: any) => {
      if (filterOption.selectedValue != null) {
        queryParams[filterOption.optionValue] = filterOption.selectedValue;
      }
    });

    // end filter conditions
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true,
    });
  }

  loadData(
    page: number = this.page,
    searchQuery: string = this.searchQuery,
    sortBy: string = this.fcFilterDialogService.getSortString(
      this.fcFilterConfig
    )
  ) {
    this.setParam();
    this.loading = true;

    let queryString = '';

    let dataListParameter: DataListParameter = {} as DataListParameter;
    dataListParameter.rows = this.rows;
    dataListParameter.page = page;
    dataListParameter.sortBy = sortBy;
    dataListParameter.filterObj = this.fcFilterDialogService.getFilterString(
      this.fcFilterConfig
    );
    dataListParameter.searchQuery = searchQuery;
    dataListParameter.queryString = queryString;
    this.salePaymentService
      .getSalePayments(dataListParameter)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.totalRecords = res.data.count;
          this.totalPages =
            this.totalRecords > this.rows
              ? Math.ceil(this.totalRecords / this.rows) || 1
              : 1;
          this.salePayments = res.data.sale_payments;

          this.loading = false;
          this.layoutService.setSearchConfig({
            loading: false,
          });
        },
        error: (err: any) => {
          this.loading = false;
          this.layoutService.setSearchConfig({
            loading: false,
          });
        },
      });
  }

  // Table Requirement
  columns = [
    {
      label: 'Customer',
      field: 'customer.name',
      formatter: (value: any, row: any) => row.customer?.name || '-',
    },
    {
      label: 'Status',
      field: 'status',
      formatter: (value: any, row: any) => {
        const label = row.status_label || 'Unknown';

        let colorClass = 'text-gray-700';
        switch (value) {
          case 0: // Draft
            colorClass = 'text-yellow-600';
            break;
          case 1: //Approved
            colorClass = 'text-green-600';
            break;
          case 2: // Cancelled
            colorClass = 'text-red-600';
            break;
        }

        return `<p class="font-medium text-sm ${colorClass}">${label}</p>`;
      },
    },
    {
      label: 'Payment Date',
      field: 'date',
      formatter: (value: any) => {
        if (!value) return '-';
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
    },
    {
      label: 'Payment Method',
      field: 'payment_method',
      formatter: (value: any, row: any) => {
        const label = row.payment_method_label || 'Unknown';
        return label;
      },
    },
    {
      label: 'Amount Paid',
      field: 'total',
      formatter: (value: any, row: any) => {
        if (!row.total) return '-';
        return this.fcCurrencyPipe.transform(Number(row.total));
      },
    },
  ];

  getSalePaymentPrimary(row: any): string {
    return row.customer?.name;
  }

  getSalePaymentSecondary(row: any): { label: string; colorClass: string } {
    const label = row.status_label || 'Unknown';

    let colorClass = 'bg-tertiary-200 text-gray-700';
    switch (row.status) {
      case 0:
        colorClass = 'text-yellow-600 bg-yellow-100';
        break;
      case 1:
        colorClass = 'text-green-600 bg-green-100';
        break;
      case 2:
        colorClass = 'text-red-600 bg-red-100';
        break;
    }

    return { label, colorClass };
  }

  navigateToDetail(salePayment: SalePayment) {
    this.router.navigate(['/sale-payment/view/', salePayment.id]);
  }

  search() {
    this.page = 1;
    this.loadData();
  }

  onPageUpdate(pagination: any) {
    let page = pagination.page;
    let rows = pagination.rows;
    this.rows = rows;
    if (page > 0) {
      this.page = page;
    } else {
      this.page = 1;
    }
    this.loadData(this.page);
  }
}
