import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttachmentAddDialogComponent } from '@features/attachment/component/attachment-add-dialog/attachment-add-dialog.component';
import { AttachmentService } from '@features/attachment/services/attachment.service';
import { AuthService } from '@features/auth/services/auth.service';
import { Project } from '@features/project/interfaces/project.interfaces';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClock,
  faFile,
  faFileAlt,
  faFilePdf,
  faFileWord,
} from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { SharedModule } from '@shared/shared.module';
import { DialogService } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-attachment-list',
  imports: [FontAwesomeModule, SharedModule, CommonModule, TooltipModule],
  templateUrl: './attachment-list.component.html',
  styleUrl: './attachment-list.component.css',
  standalone: true,
})
export class AttachmentListComponent {
  private readonly destroy$ = new Subject<void>();

  faClock = faClock;

  attachments: any[] = [];
  project: Project = {} as Project;
  authUser: any;

  loading: boolean = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  searchQuery: string = '';

  @Input() projectId!: string;

  actionButtons: any[] = [
    {
      id: 1,
      label: 'Add Attachment',
      icon: './assets/images/icons/add.svg',
      roles: [0, 1, 2],
      action: () => {
        this.addAttachment();
      },
    },
    {
      id: 2,
      label: 'Refresh',
      icon: './assets/images/icons/refresh.svg',
      roles: [0, 1, 2, 3],
      action: () => {
        this.refresh();
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
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private authService: AuthService,
    private dialogService: DialogService,
    private attachmentService: AttachmentService
  ) {
    this.project.id = String(this.route.snapshot.paramMap.get('id'));
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.page = params.page ? params.page : 1;
        this.rows = params.limit ? params.rows : 10;
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
    this.authService.getCurrentUserData.subscribe((user) => {
      if (user) {
        this.authUser = user;
      }
    });
    this.loadData();
  }

  ngOnChanges() {
    if (this.projectId) {
      this.loadData();
    }
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

    // filter condition
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

    let dataListParameter: DataListParameter = {} as DataListParameter;
    dataListParameter.rows = this.rows;
    dataListParameter.page = page;
    dataListParameter.sortBy = sortBy;
    dataListParameter.filterObj = this.fcFilterDialogService.getFilterString(
      this.fcFilterConfig
    );
    dataListParameter.searchQuery = searchQuery;

    this.attachmentService
      .getAttachmentsByProject(this.project.id, dataListParameter)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.totalRecords = res.data.count;
          this.totalPages =
            this.totalRecords > this.rows
              ? Math.ceil(this.totalRecords / this.rows) || 1
              : 1;
          this.attachments = res.data.attachments;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
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

  addAttachment() {
    const ref = this.dialogService.open(AttachmentAddDialogComponent, {
      data: {
        title: 'Add Attachment',
        project_id: this.project.id,
        project: this.project,
      },
      showHeader: false,
      contentStyle: { padding: '0' },
      style: { overflow: 'hidden' },
      styleClass: 'rounded-sm',
      modal: true,
      dismissableMask: true,
      width: '450px',
    });
    ref.onClose.subscribe((newAttachment: any) => {
      if (newAttachment) {
        this.attachments.unshift(newAttachment);
        this.totalRecords++;
        this.totalPages = Math.ceil(this.totalRecords / this.rows);
      }
    });
  }

  refresh() {
    this.loadData();
  }

  goToFeedback(attachmentId: string) {
    this.router.navigate(['/feedback'], {
      queryParams: { attachment_id: attachmentId },
    });
  }

  getFileIcon(url: string) {
    const ext = url.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return faFilePdf;
      case 'doc':
      case 'docx':
        return faFileWord;
      case 'txt':
      case 'md':
        return faFileAlt;
      default:
        return faFile;
    }
  }

  isImage(fileUrl: string): boolean {
    return /\.(jpe?g|png|gif|webp|bmp)$/i.test(fileUrl);
  }
}
