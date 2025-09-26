import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { Project } from '@features/project/interfaces/project.interfaces';
import { ProjectService } from '@features/project/services/project.service';
import { User, UserRole } from '@features/user/interfaces/user';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { SharedModule } from '@shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, take, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.css',
  imports: [
    CommonModule,
    SharedModule,
    TooltipModule,
    FontAwesomeModule,
    ButtonModule,
    FormsModule,
    RouterModule,
  ],
  providers: [DialogService],
})
export class TemplateListComponent {
  private readonly destroy$ = new Subject<void>();

  faSearch = faSearch;
  loading: boolean = false;

  authUser: User = {} as User;
  users: User[] = [];
  templates: Project[] = [];
  userRoles: UserRole[] = [];
  selectedRoleFilter: null | number = null;

  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  searchQuery: string = '';

  isTemplateMode = true;

  actionButtons: any[] = [
    {
      id: 1,
      label: 'Add Template',
      icon: '/assets/images/icons/add.svg',
      styleClass: 'border border-gray-400',
      route: ['/template/add'],
      action: () => {},
      hidden: true,
      roles: [0],
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
      roles: [0, 1, 2, 3],
    },
  ];

  fcFilterConfig: FcFilterConfig = {
    filterFields: [],
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
    private projectService: ProjectService
  ) {
    this.authUser = this.authService.getCurrentUserData.value;
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.page = params.page ? params.page : 1;
        this.rows = params.limit ? params.limit : 10;
        this.searchQuery = params.q ? params.q : '';
        this.selectedRoleFilter = params.role ? +params.role : null;

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

    // if (this.isTemplateMode) {
    //   queryParams.is_template = 1;
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
    if (this.isTemplateMode) {
      queryString += '&is_template=1';
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
          this.templates = res.data.projects;

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
    { label: 'Template Name', field: 'name' },
    {
      label: 'Total Features',
      field: 'feature_count',
      formatter: (val: any) => val ?? 0,
    },
    {
      label: 'Features',
      field: 'features',
      formatter: (features: any[]) => {
        if (!features || features.length === 0) return '-';
        return features.map((f) => f.name).join(', ');
      },
    },
  ];

  getTemplatePrimary(row: any): string {
    return row.name;
  }

  getTemplateSecondary(row: any): string {
    return row.feature_count?.toString() ?? '0';
  }

  navigateToDetail(project: Project) {
    this.router.navigate(['/template/view/', project.id]);
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
