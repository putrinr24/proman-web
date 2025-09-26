import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
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
import { ProjectService } from '@features/project/services/project.service';
import { Project } from '@features/project/interfaces/project.interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectAddProjectTypeDialogComponent } from '../../components/select-add-project-type-dialog/select-add-project-type-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
  imports: [
    CommonModule,
    SharedModule,
    TooltipModule,
    FontAwesomeModule,
    ButtonModule,
    FormsModule,
    RouterModule,
  ],
  providers: [DialogService, DynamicDialogRef],
})
export class ProjectListComponent {
  private readonly destroy$ = new Subject<void>();

  faSearch = faSearch;
  loading: boolean = false;

  // authUser: User = {} as User;
  authUser: User | null = null;
  users: User[] = [];
  projects: Project[] = [];
  userRoleEnum = UserRoleEnum;

  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  searchQuery: string = '';

  isProjectMode = true;

  actionButtons: any[] = [
    {
      id: 1,
      label: 'Add Project',
      icon: '/assets/images/icons/add.svg',
      action: () => this.openAddProjectOptions(),
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
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private authService: AuthService,
    private projectService: ProjectService,
    private dialogService: DialogService,
    private ref: DynamicDialogRef
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

  // ngOnInit(): void {
  //   this.authService.getCurrentUserData.subscribe((user) => {
  //     if (user) {
  //       this.authUser = user;

  //       const role = this.authUser?.role;
  //       this.columns = this.columns.filter((col: any) => {
  //         if (col.roles) {
  //           return col.roles.includes(role);
  //         }
  //         return true;
  //       });

  //       this.loadData();
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.authService.getCurrentUserData.subscribe((user) => {
      if (user && user.id) {
        this.authUser = user;

        // Filter kolom sesuai role
        const role = this.authUser.role;
        this.columns = this.columns.filter((col: any) => {
          if (col.roles) {
            return col.roles.includes(role);
          }
          return true;
        });

        this.loadData();
      } else {
        this.authUser = null;
      }
    });
  }

  // ngOnInit(): void {
  //   this.authService.getCurrentUserData.subscribe((user) => {
  //     if (user && user.id) {
  //       this.authUser = user;
  //       this.loadData();
  //     } else {
  //       this.authUser = null;
  //     }
  //   });
  // }

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

    // if (this.isProjectMode) {
    //   queryParams.is_template = 0;
    // }

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
    if (this.isProjectMode) {
      queryString += '&is_template=0';
    }

    let dataListParameter: DataListParameter = {} as DataListParameter;
    dataListParameter.rows = this.rows;
    dataListParameter.page = page;
    dataListParameter.sortBy = sortBy;
    dataListParameter.filterObj = this.fcFilterDialogService.getFilterString(
      this.fcFilterConfig
    );
    dataListParameter.searchQuery = searchQuery;
    dataListParameter.queryString = queryString;
    this.projectService
      .getProjects(dataListParameter)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.totalRecords = res.data.count;
          this.totalPages =
            this.totalRecords > this.rows
              ? Math.ceil(this.totalRecords / this.rows) || 1
              : 1;
          this.projects = res.data.projects;

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

  openAddProjectOptions() {
    this.ref = this.dialogService.open(SelectAddProjectTypeDialogComponent, {
      data: {
        title: 'Select Project Type',
      },
      showHeader: false,
      contentStyle: {
        padding: '0',
      },
      style: {
        overflow: 'hidden',
      },
      styleClass: 'rounded-sm',
      dismissableMask: true,
      width: '450px',
    });

    this.ref.onClose.subscribe(
      (result: { templateId?: number } | 'new' | undefined) => {
        if (result === 'new') {
          this.router.navigate(['/project/add']);
        } else if (result?.templateId) {
          this.router.navigate(['/project/add'], {
            queryParams: { template: result.templateId },
          });
        }
      }
    );

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && this.ref) {
        this.ref.close();
      }
    });
  }

  // Table Requirement
  columns = [
    { label: 'Name', field: 'name' },
    {
      label: 'PIC',
      field: 'assigned_to_user.name',
      formatter: (value: any, row: any) => row.assigned_to_user?.name || '-',
    },
    {
      label: 'Customer',
      field: 'customer.name',
      formatter: (value: any, row: any) => row.customer?.name || '-',
      roles: [0, 1, 2],
    },
    {
      label: 'Total Features',
      field: 'feature_count',
      formatter: (val: any) => val ?? 0,
    },
  ];

  getProjectPrimary(row: any): string {
    return row.name;
  }

  getProjectSecondary(row: any): string {
    return row.assigned_to_user?.name;
  }

  navigateToDetail(project: Project) {
    this.router.navigate(['/project/view/', project.id]);
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
