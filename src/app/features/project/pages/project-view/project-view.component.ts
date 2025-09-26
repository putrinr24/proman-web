import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { ProjectService } from '@features/project/services/project.service';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { User } from '@features/user/interfaces/user';
import { FeatureEditDialogComponent } from '@features/feature/components/feature-edit-dialog/feature-edit-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronDown,
  faClock,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { UserSelectDialogComponent } from '@features/user/components/user-select-dialog/user-select-dialog.component';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '@features/project/interfaces/project.interfaces';
import { FeatureService } from '@features/feature/services/feature.service';
import { TooltipModule } from 'primeng/tooltip';
import { TabsModule } from 'primeng/tabs';
import { AuthService } from '@features/auth/services/auth.service';
import { AttachmentListComponent } from '@features/attachment/pages/attachment-list/attachment-list.component';
import { FeatureStatusEnum } from '@features/feature/enums/feature-status-enum';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css',
  imports: [
    CommonModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TooltipModule,
    TabsModule,
    FormsModule,
    AttachmentListComponent,
  ],
  providers: [DialogService],
})
export class ProjectViewComponent {
  private readonly destroy$ = new Subject<void>();

  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faPlus = faPlus;
  faClock = faClock;

  actionButtons: any[] = [
    {
      id: 1,
      label: 'Refresh',
      icon: '/assets/images/icons/refresh.svg',
      styleClass: 'border border-gray-400',
      action: () => {
        this.refresh();
      },
    },
  ];

  projectForm: FormGroup;
  users: User[] = [];
  selectedCustomer: User | null = null;
  selectedProjectManager: User | null = null;
  loading = false;
  expandedRowIndex: number | null = null;

  @Input() project: Project = {} as Project;
  @Input() required = false;
  @Output() onDeleted = new EventEmitter();
  @Output() onUpdated = new EventEmitter();

  priceTotal = 0;
  remainingAmount = 0;

  attachments: any[] = [];
  userRoleEnum = UserRoleEnum;
  authUser: any;

  constructor(
    private projectService: ProjectService,
    private featureService: FeatureService,
    private location: Location,
    private fcToastService: FcToastService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.project.id = String(this.route.snapshot.paramMap.get('id'));
    this.projectForm = new FormGroup({
      name: new FormControl('', Validators.required),
      customer_id: new FormControl(null, Validators.required),
      assigned_to: new FormControl(null),
      description: new FormControl(''),
      features: new FormArray([], Validators.required),
      is_template: new FormControl(null, Validators.required),
      price_total: new FormControl(0, Validators.required),
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

  ngOnChanges(): void {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading = true;
    this.destroy$.next();
    this.projectService
      .getProject(this.project.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.project = res.data;

        this.projectForm.patchValue({
          name: res.data.name,
          customer_id: res.data.customer_id,
          assigned_to: res.data.assigned_to,
          description: res.data.description,
          is_template: res.data.is_template,
          price_total: res.data.price_total,
        });

        this.selectedCustomer = res.data.customer;
        this.selectedProjectManager = res.data.assigned_to_user;

        this.priceTotal = Number(res.data.price_total);
        this.remainingAmount = Number(res.data.remaining_amount);

        const featuresArray = this.projectForm.get('features') as FormArray;
        featuresArray.clear();

        res.data.features.forEach((feature: any) => {
          featuresArray.push(
            new FormGroup({
              id: new FormControl(feature.id),
              name: new FormControl(feature.name),
              assigned_to: new FormControl(feature.assigned_to),
              assigned_to_user: new FormControl(feature.assigned_to_user),
              price: new FormControl(feature.price),
              status_name: new FormControl(feature.status_name),
              status: new FormControl(feature.status),
              note: new FormControl(feature.note),
            })
          );
        });

        this.loading = false;
      });
  }

  onSelectCustomer() {
    const ref = this.dialogService.open(UserSelectDialogComponent, {
      data: {
        title: 'Select Customer',
        roleToFilter: [UserRoleEnum.CUSTOMER],
      },
      showHeader: false,
      contentStyle: {
        padding: '0',
      },
      style: {
        overflow: 'hidden',
      },
      styleClass: 'rounded-sm',
      modal: true,
      dismissableMask: true,
      width: '450px',
    });
    ref.onClose.subscribe((user) => {
      if (user) {
        this.selectedCustomer = user;
        this.projectForm.get('customer_id')?.setValue(user.id);
      }
    });
  }

  removeCustomer() {
    this.selectedCustomer = null;
  }

  onAssignedToProjectManager() {
    const ref = this.dialogService.open(UserSelectDialogComponent, {
      data: {
        title: 'Select Project Manager',
        roleToFilter: [UserRoleEnum.PROJECT_MANAGER],
      },
      showHeader: false,
      contentStyle: {
        padding: '0',
      },
      style: {
        overflow: 'hidden',
      },
      styleClass: 'rounded-sm',
      modal: true,
      dismissableMask: true,
      width: '450px',
    });
    ref.onClose.subscribe((user) => {
      if (user) {
        this.selectedProjectManager = user;
      }
    });
  }

  removeProjectManager() {
    this.selectedProjectManager = null;
  }

  get features(): FormArray {
    return this.projectForm.get('features') as FormArray;
  }

  addFeature() {
    const ref = this.dialogService.open(FeatureEditDialogComponent, {
      data: {
        title: 'Add Feature',
        features: this.features.value,
      },
      showHeader: false,
      contentStyle: {
        padding: '0',
      },
      style: {
        overflow: 'hidden',
      },
      styleClass: 'rounded-sm',
      modal: true,
      dismissableMask: true,
      width: '450px',
    });
    ref.onClose.subscribe((result: any) => {
      if (result) {
        const { bodyReq, enrichedFeature } = result;
        bodyReq.project_id = this.project.id;

        this.featureService.addFeature(bodyReq).subscribe({
          next: (res: any) => {
            const featuresArray = this.features;
            featuresArray.push(
              new FormGroup({
                id: new FormControl(res.data.id),
                name: new FormControl(res.data.name),
                assigned_to: new FormControl(res.data.assigned_to),
                assigned_to_user: new FormControl(
                  enrichedFeature.assigned_to_user
                ),
                price: new FormControl(res.data.price),
                status_name: new FormControl(enrichedFeature.status_name),
                status: new FormControl(res.data.status),
                note: new FormControl(res.data.note),
              })
            );

            // Hitung Price
            // this.priceTotal += res.data.price;
            // this.remainingAmount =
            //   this.priceTotal - Number(this.project.paid_amount || 0);
            this.recalculateTotalPrice();

            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'success',
              header: 'Success',
              message: res.message,
            });
          },
          error: (err: any) => {
            this.fcToastService.add({
              severity: 'error',
              header: 'Error Message',
              message: err.message,
            });
          },
        });
      }
    });
  }

  editFeature(index: number) {
    const feature = this.features.at(index).value;
    const ref = this.dialogService.open(FeatureEditDialogComponent, {
      data: {
        title: 'Edit Feature',
        feature: feature,
      },
      showHeader: false,
      contentStyle: { padding: '0' },
      style: { overflow: 'hidden' },
      styleClass: 'rounded-sm',
      modal: true,
      dismissableMask: true,
      width: '450px',
    });

    ref.onClose.subscribe((result: any) => {
      if (result) {
        const { bodyReq, enrichedFeature } = result;
        bodyReq.project_id = this.project.id;

        this.featureService.updateFeature(feature.id, bodyReq).subscribe({
          next: (res: any) => {
            this.features.at(index).patchValue({
              name: res.data.name,
              assigned_to: res.data.assigned_to,
              assigned_to_user: enrichedFeature.assigned_to_user,
              price: res.data.price,
              status: res.data.status,
              status_name: enrichedFeature.status_name,
              note: res.data.note,
            });

            this.recalculateTotalPrice();

            this.fcToastService.add({
              severity: 'success',
              header: 'Success',
              message: res.message || 'Feature has been updated successfully',
            });
          },
          error: (err: any) => {
            this.fcToastService.add({
              severity: 'error',
              header: 'Error',
              message: err.message,
            });
          },
        });
      }
    });
  }

  deleteFeature(index: number) {
    const featuresFormArray = this.projectForm.get('features') as FormArray;
    const feature = featuresFormArray.at(index)?.value;

    if (!feature?.id) {
      console.error('Invalid feature', feature);
      return;
    }

    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this feature?',
      accept: () => {
        this.featureService.deleteFeature(feature.id).subscribe({
          next: (res: any) => {
            featuresFormArray.removeAt(index);

            this.fcToastService.add({
              severity: 'success',
              header: 'Success Message',
              message: res.message,
            });

            // Hitung price
            // this.loadData();
            this.recalculateTotalPrice();
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

  recalculateTotalPrice() {
    const featuresArray = this.features.value;

    this.priceTotal = featuresArray.reduce((sum: number, feature: any) => {
      if (feature.status === FeatureStatusEnum.CANCELLED) return sum;
      return sum + Number(feature.price || 0);
    }, 0);

    this.remainingAmount =
      this.priceTotal - Number(this.project.paid_amount || 0);
  }

  toggleRow(index: number) {
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
  }

  isRequired(fieldName: string): boolean {
    const control = this.projectForm.get(fieldName);
    if (!control?.validator) return false;

    // Jalankan validator dengan dummy control
    const validator = control.validator({} as AbstractControl);
    return validator?.['required'] ?? false;
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    // check if the input required
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && validator['required']) {
        this.required = true;
      }
    }
    return null;
  }

  refresh() {
    this.projectForm.reset();
    this.projectForm.removeControl('features');
    this.projectForm.addControl('features', new FormArray([]));

    this.loadData();
  }

  submit() {
    this.projectForm.patchValue({
      assigned_to: this.selectedProjectManager?.id || null,
    });

    let bodyReq = JSON.parse(JSON.stringify(this.projectForm.value));

    delete bodyReq.price_total;
    delete bodyReq.features;

    this.projectService.updateProject(this.project.id, bodyReq).subscribe({
      next: (res: any) => {
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'success',
          header: 'Success',
          message: res.message,
        });
      },
      error: (err: any) => {
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'error',
          header: 'Error',
          message: err.message,
        });
      },
    });
  }

  setAsTemplate() {
    if (!this.project) return;

    let bodyReq = JSON.parse(JSON.stringify(this.projectForm.value));

    bodyReq.customer_id = this.selectedCustomer?.id;
    bodyReq.assigned_to = this.selectedProjectManager?.id;

    delete bodyReq.price_total;

    bodyReq.features = this.features.value.map((feature: any) => {
      return {
        name: feature.name,
        assigned_to: feature.assigned_to?.id,
        price: feature.price,
        status: 0,
        note: feature.note,
      };
    });

    bodyReq.is_template = true;
    bodyReq.name = `${bodyReq.name} (Template)`;

    this.projectService.addProject(bodyReq).subscribe({
      next: (res: any) => {
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'success',
          header: 'Success',
          message: 'Successfully set as template',
        });
        const templateId = res.data.id;
        this.router.navigate(['/template/view', templateId]);
      },
      error: (err: any) => {
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'error',
          header: 'Error',
          message: err.message,
        });
      },
    });
  }

  back() {
    this.location.back();
  }
}
