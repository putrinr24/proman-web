import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AttachmentService } from '@features/attachment/services/attachment.service';
import { AuthService } from '@features/auth/services/auth.service';
import { FeatureSelectDialogComponent } from '@features/feature/components/feature-select-dialog/feature-select-dialog.component';
import { Feature } from '@features/feature/interfaces/feature.interfaces';
import { User } from '@features/user/interfaces/user';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronDown,
  faCloudArrowUp,
  faFile,
  faFileAlt,
  faFilePdf,
  faImage,
  faTimes,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { SharedModule } from '@shared/shared.module';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
  DialogService,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-attachment-add-dialog',
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: './attachment-add-dialog.component.html',
  styleUrl: './attachment-add-dialog.component.css',
})
export class AttachmentAddDialogComponent {
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faCloudArrowUp = faCloudArrowUp;
  faFile = faFile;
  faXmark = faXmark;
  faTrash = faTrash;
  faImage = faImage;
  faFilePdf = faFilePdf;
  faFileAlt = faFileAlt;

  title = 'Add Attachment';
  attachmentForm: FormGroup;
  user: User[] = [];
  project: any;
  selectedFeature: Feature | null = null;
  feature: Feature[] = [];
  statuses: any[] = [];
  status_name: any;
  assigned_to_user: any;

  pastedImages: any[] = [];
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private authService: AuthService,
    private ref: DynamicDialogRef,
    private fcToastService: FcToastService,
    private cdr: ChangeDetectorRef,
    private attachmentService: AttachmentService
  ) {
    this.authService.getCurrentUserData.subscribe((user: any) => {
      if (user) {
        this.user = user;
      }
    });
    this.attachmentForm = new FormGroup({
      file: new FormControl(null),
      feature_id: new FormControl(null, Validators.required),
      note: new FormControl('', Validators.required),
    });
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
      }
    }
    if (this.user) {
      this.attachmentForm.patchValue({
        feature_id: this.feature,
      });
    }
    if (this.config.data?.project) {
      this.project = this.config.data.project;
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

  // file handler
  private readImage(blob: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageUrl = e.target?.result;

      if (imageUrl) {
        const imageObject = {
          file: blob,
          image_url: imageUrl,
        };

        // Cek duplikasi
        if (!this.pastedImages.some((image) => image.image_url === imageUrl)) {
          this.pastedImages.push(imageObject);
        }
      }
    };
    reader.readAsDataURL(blob);
  }

  @HostListener('document:paste', ['$event'])
  handlePaste(event: ClipboardEvent) {
    const items: any = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            this.readImage(blob);
          }
        }
      }
    }
  }

  @HostListener('drop', ['$event'])
  handleDrop(event: DragEvent) {
    event.preventDefault();
    const items: any = event.dataTransfer?.items;
    if (items) {
      for (const item of items) {
        if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            this.readImage(file);
          }
        }
      }
    }
  }

  @HostListener('dragover', ['$event'])
  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  removeImage(event: MouseEvent, index: number) {
    event.stopPropagation();
    this.pastedImages.splice(index, 1);
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    console.log('Files selected:', files);

    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.pastedImages.push({
            file,
            image_url: e.target.result,
          });
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }

    // Reset input setelah proses
    this.fileInputRef.nativeElement.value = '';
  }

  submit() {
    if (!this.attachmentForm.valid || !this.pastedImages.length) {
      this.fcToastService.clear();
      this.fcToastService.add({
        severity: 'warning',
        header: 'Warning',
        message: 'Please fill in all required fields.',
      });
      this.attachmentForm.markAllAsTouched();
      return;
    }

    const allowedFileTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];

    const invalidFiles = this.pastedImages.filter(
      (img) => !allowedFileTypes.includes(img.file.type)
    );

    if (invalidFiles.length > 0) {
      this.fcToastService.clear();
      this.fcToastService.add({
        severity: 'warning',
        header: 'Warning',
        message: 'Only JPG, JPEG, PNG, and PDF files are allowed.',
      });
      return;
    }

    const formValue = this.attachmentForm.value;
    const formData = new FormData();
    formData.append('feature_id', formValue.feature_id);
    formData.append('note', formValue.note);
    this.pastedImages.forEach((image: any, i: number) => {
      formData.append(`file[${i}]`, image.file);
    });

    this.attachmentService.addAttachment(formData).subscribe({
      next: (res: any) => {
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'success',
          header: 'Success',
          message: res.message,
        });

        const newAttachment = res.data;

        if (this.selectedFeature) {
          newAttachment.feature = this.selectedFeature;
        } else if (this.project && this.project.features) {
          const featureObj = this.project.features.find(
            (f: any) => f.id === newAttachment.feature_id
          );
          if (featureObj) {
            newAttachment.feature = featureObj;
          }
        }

        this.ref.close(newAttachment);
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

  onClose() {
    this.ref.close();
  }
}
