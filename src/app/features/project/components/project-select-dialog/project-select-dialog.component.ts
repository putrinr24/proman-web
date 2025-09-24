import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Project } from '@features/project/interfaces/project.interfaces';
import { ProjectService } from '@features/project/services/project.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTimes,
  faRefresh,
  faPlus,
  faSearch,
  faCube,
} from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { SharedModule } from '@shared/shared.module';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-project-select-dialog',
  imports: [
    FontAwesomeModule,
    TooltipModule,
    RouterModule,
    SharedModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './project-select-dialog.component.html',
  styleUrl: './project-select-dialog.component.css',
})
export class ProjectSelectDialogComponent {
  private readonly destroy$: any = new Subject<void>();

  faTimes = faTimes;
  faRefresh = faRefresh;
  faPlus = faPlus;
  faCube = faCube;
  faSearch = faSearch;

  projects: Project[] = [];
  searchQuery: string = '';
  loading = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  title = 'Select Project';

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
    private projectService: ProjectService,
    private fcFilterDialogService: FcFilterDialogService
  ) {
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
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
    params.push(`page=${this.rows}`);

    // sorting
    if (this.fcFilterConfig?.sort?.selectedField) {
      params.push(`order_by=${this.fcFilterConfig.sort.selectedField}`);
      params.push(`direction=${this.fcFilterConfig.sort.direction || 'asc'}`);
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

    const dataListParameter: DataListParameter = {
      rows: this.rows,
      page: page || this.page,
      sortBy: sortBy,
      filterObj: filterObj,
      searchQuery: searchQuery,
      queryString: '&is_template=0',
    };

    this.projectService
      .getProjects(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.totalRecords = res.data.count;
        this.totalPages =
          this.totalRecords > this.rows
            ? Math.ceil(this.totalRecords / this.rows) || 1
            : 1;
        this.projects = res.data.projects;
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

  submit(res: Project) {
    this.ref.close(res);
  }

  onClose() {
    this.ref.close();
  }
}
