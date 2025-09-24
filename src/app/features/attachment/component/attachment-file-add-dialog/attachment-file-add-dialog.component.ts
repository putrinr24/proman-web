import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AttachmentService } from '@features/attachment/services/attachment.service';
import { AuthService } from '@features/auth/services/auth.service';
import { User } from '@features/user/interfaces/user';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTimes,
  faTrash,
  faImage,
  faFilePdf,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { SharedModule } from '@shared/shared.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-attachment-file-add-dialog',
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: './attachment-file-add-dialog.component.html',
  styleUrl: './attachment-file-add-dialog.component.css',
})
export class AttachmentFileAddDialogComponent {
  faTimes = faTimes;
  faTrash = faTrash;
  faImage = faImage;
  faFilePdf = faFilePdf;
  faFileAlt = faFileAlt;

  title = 'Add Attachment File';
  attachmentFileForm: FormGroup;
  attachmentId!: string;
  user: User[] = [];
  pastedImages: any[] = [];
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private config: DynamicDialogConfig,
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
    this.attachmentFileForm = new FormGroup({
      file: new FormControl(null),
    });
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
      }
    }
    if (this.config.data?.attachmentId) {
      this.attachmentId = this.config.data.attachmentId;
    }
  }

  submit() {
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

    const formData = new FormData();
    this.pastedImages.forEach((image: any, i: number) => {
      formData.append(`file[${i}]`, image.file);
    });

    this.attachmentService
      .addAttachmentFile(this.attachmentId, formData)
      .subscribe({
        next: (res: any) => {
          console.log('Res balik dari API:', res);
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Success',
            message: res.message,
          });
          this.ref.close(res.data);
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
}
