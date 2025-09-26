import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { User } from '@features/user/interfaces/user';
import { UserService } from '@features/user/services/user.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, take, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    SharedModule,
    TooltipModule,
    RouterModule,
    TableModule,
    ButtonModule,
  ],
  providers: [DialogService],
})
export class UserListComponent {
  private readonly destroy$ = new Subject<void>();

  faSearch = faSearch;
  loading: boolean = false;

  authUser: User = {} as User;
  users: User[] = [];
  selectedUser: User | undefined;

  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  searchQuery: string = '';

  actionButtons: any[] = [
    {
      id: 1,
      label: 'Add User',
      icon: '/assets/images/icons/add.svg',
      route: ['/user/add'],
      action: () => {},
      hidden: true,
    },
    {
      id: 2,
      label: 'Refresh',
      icon: '/assets/images/icons/refresh.svg',
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
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private authService: AuthService
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
    this.userService
      .getUsers(dataListParameter)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.totalRecords = res.data.count;
          this.totalPages =
            this.totalRecords > this.rows
              ? Math.ceil(this.totalRecords / this.rows) || 1
              : 1;
          this.users = res.data.users;
          if (!this.selectedUser) {
            if (this.users.length > 0) {
              this.selectedUser = this.users[0];
            }
          }
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

  // table requirement
  columns = [
    { label: 'Name', field: 'name' },
    { label: 'Role', field: 'role_name' },
    { label: 'Email', field: 'email' },
    { label: 'Phone Number', field: 'phone_no' },
  ];

  getUserPrimary(row: any): string {
    return row.name;
  }

  getUserSecondary(row: any): string {
    return row.role_name;
  }

  navigateToDetail(user: User) {
    this.router.navigate(['/user/view/', user.id]);
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
