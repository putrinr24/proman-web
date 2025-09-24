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
import { getFeatureStatusEnumLabel } from '@features/feature/enums/feature-status-enum';
import { FeatureService } from '@features/feature/services/feature.service';
import { UserSelectDialogComponent } from '@features/user/components/user-select-dialog/user-select-dialog.component';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';
import { User } from '@features/user/interfaces/user';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SharedModule } from '@shared/shared.module';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
  DialogService,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-feature-add-dialog',
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: './feature-add-dialog.component.html',
  styleUrl: './feature-add-dialog.component.css',
  providers: [DialogService],
})
export class FeatureAddDialogComponent {
  faTimes = faTimes;
  faChevronDown = faChevronDown;

  title = 'Add Feature';
  featureForm: FormGroup;
  user: User[] = [];
  selectedDeveloper: User | null = null;
  statuses: any[] = [];
  status_name: any;

  constructor(
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private authService: AuthService,
    private ref: DynamicDialogRef,
    private featureService: FeatureService,
    private fcDirtyStateService: FcDirtyStateService
  ) {
    this.authService.getCurrentUserData.subscribe((user: any) => {
      if (user) {
        this.user = user;
      }
    });
    this.featureForm = new FormGroup({
      name: new FormControl('', Validators.required),
      assigned_to: new FormControl(null),
      price: new FormControl(null, Validators.required),
      status: new FormControl(0, Validators.required),
      note: new FormControl(''),
    });
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
      }
      if (this.config.data.feature) {
        const feature = this.config.data.feature;
        this.featureForm.patchValue({
          name: feature.name,
          assigned_to: feature.assigned_to || null,
          price: feature.price,
          status: feature.status,
          note: feature.note || '',
        });
        this.selectedDeveloper = feature.assigned_to || null;
      }
    }
    if (this.user) {
      this.featureForm.patchValue({
        assigned_to: this.user,
      });
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  getFeatureStatusLabel(status: number): string {
    return getFeatureStatusEnumLabel(status);
  }

  loadData() {
    this.featureService.getFeatureStatuses().subscribe({
      next: (res: any) => {
        this.statuses = res.data;
      },
      error: (err) => {
        console.error('Error', err);
      },
    });
  }

  onAssignedToDeveloper() {
    const ref = this.dialogService.open(UserSelectDialogComponent, {
      data: {
        title: 'Select Developer',
        roleToFilter: [UserRoleEnum.DEVELOPER, UserRoleEnum.PROJECT_MANAGER],
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
      modal: true,
      width: '450px',
    });
    ref.onClose.subscribe((user) => {
      console.log('User developer:', user);
      if (user) {
        this.selectedDeveloper = user;
        this.featureForm.patchValue({ assigned_to: user.id });
      }
    });
  }

  removeDeveloper() {
    this.selectedDeveloper = null;
  }

  isRequired(fieldName: string): boolean {
    const control = this.featureForm.get(fieldName);
    if (!control?.validator) return false;

    // Jalankan validator dengan dummy control
    const validator = control.validator({} as AbstractControl);
    return validator?.['required'] ?? false;
  }

  submit() {
    if (this.featureForm.invalid) {
      this.fcDirtyStateService.checkFormValidation(this.featureForm);
      return;
    }

    const formValue = this.featureForm.value;

    // Sisipkan assigned_to dari selectedDeveloper (karena tidak pakai formControl di template)

    formValue.assigned_to = this.selectedDeveloper || null;
    console.log('Assigned to fitur ke siapa', formValue.assigned_to);
    formValue.status_name = getFeatureStatusEnumLabel(formValue.status) || null;

    this.ref.close(formValue);
  }

  onClose() {
    this.ref.close();
  }
}
