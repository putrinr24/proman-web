import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { FcDirtyStateService } from '@core/service/fc-dirty-state.service';
import { AuthService } from '@features/auth/services/auth.service';
import { FeatureSelectDialogComponent } from '@features/feature/components/feature-select-dialog/feature-select-dialog.component';
import { Feature } from '@features/feature/interfaces/feature.interfaces';
import { Attachment } from '@features/project/interfaces/project.interfaces';
import { User } from '@features/user/interfaces/user';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronDown,
  faCloudArrowUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { SharedModule } from '@shared/shared.module';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
  DialogService,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-attachment-edit-dialog',
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: './attachment-edit-dialog.component.html',
  styleUrl: './attachment-edit-dialog.component.css',
})
export class AttachmentEditDialogComponent {
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faCloudArrowUp = faCloudArrowUp;

  title = 'Edit Attachment';
  attachmentForm: FormGroup;
  attachment: Attachment = {} as Attachment;
  user: User[] = [];
  project: any;
  selectedFeature: Feature | null = null;
  feature: Feature[] = [];
  statuses: any[] = [];
  status_name: any;
  assigned_to_user: any;

  constructor(
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private authService: AuthService,
    private ref: DynamicDialogRef,
    private fcDirtyStateService: FcDirtyStateService
  ) {
    this.authService.getCurrentUserData.subscribe((user: any) => {
      if (user) {
        this.user = user;
      }
    });
    this.attachmentForm = new FormGroup({
      feature_id: new FormControl(null, Validators.required),
      note: new FormControl('', Validators.required),
    });
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
      }
    }
    if (this.config.data?.attachment) {
      const att = this.config.data.attachment;
      this.attachment = att;

      this.attachmentForm.patchValue({
        feature_id: att.feature_id,
        note: att.note,
      });
      if (att.feature) {
        this.selectedFeature = att.feature;
      }
    }
    if (this.config.data?.project) {
      this.project = this.config.data.project;
      if (this.project.features) {
        this.feature = this.project.features;
      }
    }
  }

  isRequired(fieldName: string): boolean {
    const control = this.attachmentForm.get(fieldName);
    if (!control?.validator) return false;

    // Jalankan validator dengan dummy control
    const validator = control.validator({} as AbstractControl);
    return validator?.['required'] ?? false;
  }

  onSelectFeature() {
    const ref = this.dialogService.open(FeatureSelectDialogComponent, {
      data: {
        title: 'Select Feature',
        project_id: this.config.data.project_id,
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
    ref.onClose.subscribe((feature) => {
      if (feature) {
        this.selectedFeature = feature;
        this.attachmentForm.patchValue({ feature_id: feature.id });
      }
    });
  }

  removeFeature() {
    this.selectedFeature = null;
  }

  submit() {
    if (this.attachmentForm.invalid) {
      this.fcDirtyStateService.checkFormValidation(this.attachmentForm);
      return;
    }

    const formValue = this.attachmentForm.value;

    const body = {
      feature_id: formValue.feature_id,
      note: formValue.note,
    };

    this.ref.close(body);
  }

  onClose() {
    this.ref.close();
  }
}
