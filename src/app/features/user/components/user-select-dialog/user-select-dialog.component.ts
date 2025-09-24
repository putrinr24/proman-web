import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';
import { User } from '@features/user/interfaces/user';
import { UserService } from '@features/user/services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faRefresh,
  faSearch,
  faTimes,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { SharedModule } from '@shared/shared.module';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-customer-select-dialog',
  imports: [
    FontAwesomeModule,
    RouterModule,
    SharedModule,
    CommonModule,
    FormsModule,
    TooltipModule,
  ],
  templateUrl: './user-select-dialog.component.html',
  styleUrl: './user-select-dialog.component.css',
})
export class UserSelectDialogComponent {
  private readonly destroy$: any = new Subject<void>();

  faTimes = faTimes;
  faRefresh = faRefresh;
  faPlus = faPlus;
  faUser = faUser;
  faSearch = faSearch;

  users: User[] = [];
  // roleToFilter: UserRoleEnum | null = null;
  roleToFilter: UserRoleEnum[] = [];

  searchQuery: string = '';
  loading = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  title = 'Select Customer';

  fcFilterConfig: FcFilterConfig = {
    filterFields: [],
    sort: {
      fields: [{ name: 'name', header: 'Name' }],
      selectedField: 'id',
      direction: 'desc',
    },
  };

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private userService: UserService,
    private fcFilterDialogService: FcFilterDialogService
  ) {
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
      }
      if (this.config.data.roleToFilter) {
        this.roleToFilter = this.config.data.roleToFilter;
      }
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterOnInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setParam(): string {
    const params: string[] = [];

    // pagination
    params.push(`page=${this.page}`);
    params.push(`limit=${this.rows}`);

    // sorting
    if (this.fcFilterConfig?.sort?.selectedField) {
      params.push(`order_by=${this.fcFilterConfig.sort.selectedField}`);
      params.push(`direction=${this.fcFilterConfig.sort.direction || 'asc'}`);
    }

    // filter by role
    // if (this.roleToFilter !== null) {
    //   params.push(`role=${this.roleToFilter}`);
    // }
    if (this.roleToFilter.length > 0) {
      this.roleToFilter.forEach((role) => params.push(`role=${role}`));
    }

    // search
    if (this.searchQuery) {
      params.push(`q=${this.searchQuery}`);
    }

    return params.join('&');
  }

  loadData(
    page: number = 0,
    searchQuery: string = this.searchQuery,
    filterObj: string = this.fcFilterDialogService.getFilterString(
      this.fcFilterConfig
    ),
    sortBy: string = this.fcFilterDialogService.getSortString(
      this.fcFilterConfig
    )
  ) {
    this.loading = true;
    const queryString = this.setParam();

    this.userService
      .getUsersByParamString(queryString)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.totalRecords = res.data.count;
        this.totalPages =
          this.totalRecords > this.rows
            ? Math.ceil(this.totalRecords / this.rows) || 1
            : 1;
        this.users = res.data.users;
      });
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

  search() {
    this.page = 1;
    this.loadData(this.page);
  }

  submit(res: User) {
    this.ref.close(res);
  }

  onClose() {
    this.ref.close();
  }
}
