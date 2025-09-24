import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { ProjectService } from '@features/project/services/project.service';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { User } from '@features/user/interfaces/user';
import { FeatureAddDialogComponent } from '@features/feature/components/feature-add-dialog/feature-add-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faMinus,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { UserSelectDialogComponent } from '@features/user/components/user-select-dialog/user-select-dialog.component';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';
import { ActivatedRoute, Router } from '@angular/router';
import { getFeatureStatusEnumLabel } from '@features/feature/enums/feature-status-enum';
import { FcDirtyStateService } from '@core/service/fc-dirty-state.service';

@Component({
  selector: 'app-project-add',
  imports: [SharedModule, ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './project-add.component.html',
  styleUrl: './project-add.component.css',
  providers: [DialogService],
})
export class ProjectAddComponent {
  private readonly destroy$ = new Subject<void>();

  faTimes = faTimes;
  faPlus = faPlus;
  faMinus = faMinus;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  projectForm: FormGroup;
  users: User[] = [];
  selectedCustomer: User | null = null;
  selectedProjectManager: User | null = null;
  loading = false;
  expandedRowIndex: number | null = null;

  constructor(
    private projectService: ProjectService,
    private location: Location,
    private fcToastService: FcToastService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private route: ActivatedRoute,
    private router: Router,
    private fcDirtyStateService: FcDirtyStateService
  ) {
    this.projectForm = new FormGroup({
      name: new FormControl('', Validators.required),
      customer_id: new FormControl(null, Validators.required),
      assigned_to: new FormControl(null),
      description: new FormControl(''),
      features: new FormArray([]),
      is_template: new FormControl(false),
      price_total: new FormControl(0, Validators.required),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const templateId = params['template'];
      if (templateId) {
        this.loadTemplate(templateId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isRequired(fieldName: string): boolean {
    const control = this.projectForm.get(fieldName);
    if (!control?.validator) return false;

    // Jalankan validator dengan dummy control
    const validator = control.validator({} as AbstractControl);
    return validator?.['required'] ?? false;
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
    this.projectForm.get('customer_id')?.reset();
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
        this.projectForm.get('assigned_to')?.setValue(user.id);
      }
    });
  }

  removeProjectManager() {
    this.selectedProjectManager = null;
  }

  loadTemplate(templateId: string) {
    this.projectService.getProject(templateId).subscribe((res: any) => {
      const template = res.data;

      this.projectForm.patchValue({
        name: `${template.name} (Copy)`,
        customer_id: template.customer?.id || null,
        assigned_to: template.assigned_to || null,
        description: template.description,
        is_template: false,
      });

      this.selectedCustomer = template.customer || null;
      this.selectedProjectManager = template.assigned_to_user || null;

      const featuresArray = this.projectForm.get('features') as FormArray;
      featuresArray.clear();

      template.features.forEach((feature: any) => {
        const price = Number(feature.price) || 0;

        featuresArray.push(
          new FormGroup({
            name: new FormControl(feature.name),
            // assigned_to: new FormControl(feature.assigned_to),
            assigned_to: new FormControl(feature.assigned_to_user || null),
            price: new FormControl(price),
            status: new FormControl(feature.status),
            note: new FormControl(feature.note),
            status_name: new FormControl(
              getFeatureStatusEnumLabel(feature.status)
            ),
          })
        );
      });

      // Update price_total setiap kali features berubah
      featuresArray.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.projectForm.get('price_total')?.setValue(this.totalFeaturePrice);
        });

      // Set total price awal dari template
      this.projectForm.get('price_total')?.setValue(this.totalFeaturePrice);
    });
  }

  get features(): FormArray {
    return this.projectForm.get('features') as FormArray;
  }

  get totalFeaturePrice(): number {
    return this.features.value.reduce(
      (sum: any, feature: any) => sum + (feature.price || 0),
      0
    );
  }

  addFeature() {
    const ref = this.dialogService.open(FeatureAddDialogComponent, {
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
      width: '500px',
    });
    ref.onClose.subscribe((feature: any) => {
      if (feature) {
        this.features.push(new FormControl(feature));
      }
    });
  }

  editFeature(index: number) {
    let feature = JSON.parse(JSON.stringify(this.features.value[index]));
    const ref = this.dialogService.open(FeatureAddDialogComponent, {
      data: {
        title: 'Edit Feature',
        feature: feature,
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
      width: '500px',
    });
    ref.onClose.subscribe((feature) => {
      if (feature) {
        this.features.at(index).patchValue(feature);
      }
    });
  }

  deleteFeature(index: number) {
    console.log('index', index);
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.features.removeAt(index);
      },
    });
  }

  toggleRow(index: number) {
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
  }

  submit() {
    if (this.projectForm.invalid) {
      this.fcDirtyStateService.checkFormValidation(this.projectForm);
      return;
    }

    if (this.features.length === 0) {
      this.fcToastService.clear();
      this.fcToastService.add({
        severity: 'warning',
        header: 'Warning',
        message: 'Please add at least 1 feature.',
      });
      return;
    }

    let bodyReq = JSON.parse(JSON.stringify(this.projectForm.value));

    bodyReq.customer_id = this.selectedCustomer?.id;
    bodyReq.assigned_to = this.selectedProjectManager?.id;

    delete bodyReq.price_total;

    bodyReq.features = this.features.value.map((feature: any) => {
      return {
        name: feature.name,
        assigned_to: feature.assigned_to?.id,
        price: feature.price,
        status: feature.status,
        note: feature.note,
      };
    });

    this.projectService.addProject(bodyReq).subscribe({
      next: (res: any) => {
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'success',
          header: 'Success',
          message: res.message,
        });
        this.router.navigate(['/project/view', res.data.id]);
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
