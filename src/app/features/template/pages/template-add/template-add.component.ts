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
import { FeatureAddDialogComponent } from '@features/feature/components/feature-add-dialog/feature-add-dialog.component';
import { ProjectService } from '@features/project/services/project.service';
import { User } from '@features/user/interfaces/user';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faMinus,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { SharedModule } from '@shared/shared.module';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-template-add',
  imports: [SharedModule, ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './template-add.component.html',
  styleUrl: './template-add.component.css',
  providers: [DialogService],
})
export class TemplateAddComponent {
  private readonly destroy$ = new Subject<void>();

  faTimes = faTimes;
  faPlus = faPlus;
  faMinus = faMinus;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  templateForm: FormGroup;
  users: User[] = [];

  loading = false;
  expandedRowIndex: number | null = null;

  constructor(
    private projectService: ProjectService,
    private location: Location,
    private fcToastService: FcToastService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService
  ) {
    this.templateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      customer_id: new FormControl(null),
      assigned_to: new FormControl(null),
      description: new FormControl(''),
      features: new FormArray([], Validators.required),
      is_template: new FormControl(true),
      price_total: new FormControl(0, Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get features(): FormArray {
    return this.templateForm.get('features') as FormArray;
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
    ref.onClose.subscribe((feature) => {
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

  isRequired(fieldName: string): boolean {
    const control = this.templateForm.get(fieldName);
    if (!control?.validator) return false;

    // Jalankan validator dengan dummy control
    const validator = control.validator({} as AbstractControl);
    return validator?.['required'] ?? false;
  }

  submit() {
    let bodyReq = JSON.parse(JSON.stringify(this.templateForm.value));

    delete bodyReq.price_total;
    bodyReq.features = this.features.value.map((features: any) => {
      return {
        name: features.name,
        assigned_to: features.assigned_to?.id,
        price: features.price,
        status: features.status,
        note: features.note,
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
        this.location.back();
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
