import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { FeatureEditDialogComponent } from '@features/feature/components/feature-edit-dialog/feature-edit-dialog.component';
import { FeatureService } from '@features/feature/services/feature.service';
import { Project } from '@features/project/interfaces/project.interfaces';
import { ProjectService } from '@features/project/services/project.service';
import { User } from '@features/user/interfaces/user';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { SharedModule } from '@shared/shared.module';
import { DialogService } from 'primeng/dynamicdialog';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-template-view',
  imports: [
    CommonModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TooltipModule,
    TabsModule,
    FormsModule,
  ],
  templateUrl: './template-view.component.html',
  styleUrl: './template-view.component.css',
  providers: [DialogService],
})
export class TemplateViewComponent {
  private readonly destroy$ = new Subject<void>();

  faPlus = faPlus;

  actionButtons: any[] = [
    {
      id: 1,
      label: 'Refresh',
      icon: '/assets/images/icons/refresh.svg',
      action: () => {
        this.refresh();
      },
    },
  ];

  templateForm: FormGroup;
  selectedCustomer: User | null = null;
  selectedProjectManager: User | null = null;
  loading = false;
  @Input() template: Project = {} as Project;

  expandedRowIndex: number | null = null;
  authUser: any;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private fcToastService: FcToastService,
    private fcConfirmService: FcConfirmService,
    private dialogService: DialogService,
    private featureService: FeatureService,
    private authService: AuthService
  ) {
    this.template.id = String(this.route.snapshot.paramMap.get('id'));
    this.templateForm = new FormGroup({
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get features(): FormArray {
    return this.templateForm.get('features') as FormArray;
  }

  loadData() {
    this.loading = true;
    this.destroy$.next();
    this.projectService
      .getProject(this.template.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.template = res.data;

        this.templateForm.patchValue({
          name: res.data.name,
          // customer_id: res.data.customer.id,
          // assigned_to: res.data.assigned_to,
          description: res.data.description,
          is_template: res.data.is_template,
          price_total: res.data.price_total,
        });

        this.selectedCustomer = res.data.customer;
        this.selectedProjectManager = res.data.assigned_to_user;

        const featuresArray = this.templateForm.get('features') as FormArray;
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
      });
    this.loading = false;
  }

  refresh() {
    this.templateForm.reset();
    this.templateForm.removeControl('features');
    this.templateForm.addControl('features', new FormArray([]));

    this.loadData();
  }

  createProjectFromTemplate() {
    const templateId = this.template.id;
    this.router.navigate(['/project/add'], {
      queryParams: { template: templateId },
    });
  }

  toggleRow(index: number) {
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
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
        bodyReq.project_id = this.template.id;

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
        bodyReq.project_id = this.template.id;

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
    const featuresFormArray = this.templateForm.get('features') as FormArray;
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

  submit() {
    this.templateForm.patchValue({
      assigned_to: this.selectedProjectManager?.id || null,
    });

    let bodyReq = JSON.parse(JSON.stringify(this.templateForm.value));

    delete bodyReq.price_total;
    delete bodyReq.features;

    this.projectService.updateProject(this.template.id, bodyReq).subscribe({
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
}
