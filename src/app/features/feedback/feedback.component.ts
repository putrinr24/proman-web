import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService } from './services/feedback.service';
import { CommonModule, Location } from '@angular/common';
import { AttachmentService } from '@features/attachment/services/attachment.service';
import { User } from '@features/user/interfaces/user';
import { AuthService } from '@features/auth/services/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClock,
  faEllipsisV,
  faFile,
  faFileAlt,
  faFilePdf,
  faFileWord,
  faPaperPlane,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { SharedModule } from '@shared/shared.module';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AttachmentFileAddDialogComponent } from '@features/attachment/component/attachment-file-add-dialog/attachment-file-add-dialog.component';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';
import { TooltipModule } from 'primeng/tooltip';
import { AttachmentEditDialogComponent } from '@features/attachment/component/attachment-edit-dialog/attachment-edit-dialog.component';
import { Project } from '@features/project/interfaces/project.interfaces';

@Component({
  selector: 'app-feedback',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
    TooltipModule,
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
  providers: [DialogService],
})
export class FeedbackComponent {
  faSend = faPaperPlane;
  faClock = faClock;
  faTrash = faTrash;
  faPlus = faPlus;
  faDot = faEllipsisV;

  actionButtons: any[] = [
    {
      id: 1,
      label: 'Refresh Attachment',
      icon: '/images/icons/refresh.svg',
      action: () => {
        this.refreshAttachment();
      },
    },
    {
      id: 2,
      label: 'Refresh Feedback',
      icon: '/images/icons/refresh.svg',
      action: () => {
        this.refreshFeedback();
      },
    },
  ];

  feedbackForm: FormGroup;
  feedbacks: any[] = [];
  attachment: any;
  attachmentId: string | null = null;
  attachmentFiles: any[] = [];
  project: Project = {} as Project;
  authUser: User = {} as User;
  user: User | null = null;
  userRoleEnum = UserRoleEnum;

  loading = false;
  loadingAttachment = false;
  loadingFeedback = false;

  constructor(
    private route: ActivatedRoute,
    private feedbackService: FeedbackService,
    private attachmentService: AttachmentService,
    private authService: AuthService,
    private fcToastService: FcToastService,
    private fcConfirmationService: FcConfirmService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private fcConfirmService: FcConfirmService,
    private location: Location
  ) {
    this.authUser = this.authService.getCurrentUserData.value;
    this.feedbackForm = new FormGroup({
      message: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserData.subscribe((user: User) => {
      if (user) {
        this.user = user;
      }
    });
    this.route.queryParamMap.subscribe((params) => {
      const attachmentId = params.get('attachment_id');
      if (attachmentId) {
        this.attachmentId = attachmentId;
        this.loadAttachment(attachmentId);
        this.loadFeedbacks(attachmentId);
      }
    });
  }

  loadAttachment(attachmentId: string) {
    this.loadingAttachment = true;
    this.attachmentService.getAttachmentById(attachmentId).subscribe({
      next: (res: any) => {
        this.attachment = Array.isArray(res.data) ? res.data[0] : res.data;
        this.loadingAttachment = false;
      },
      error: () => (this.loadingAttachment = false),
    });
  }

  loadFeedbacks(attachmentId: string) {
    this.loadingFeedback = true;
    this.feedbackService.getFeedbacksByAttachment(attachmentId).subscribe({
      next: (res: any) => {
        this.feedbacks = res.data.feedbacks;
        this.loadingFeedback = false;
      },
      error: () => (this.loadingFeedback = false),
    });
  }

  editAttachment() {
    const attachment = this.attachment;
    const ref = this.dialogService.open(AttachmentEditDialogComponent, {
      data: {
        title: 'Edit Attachment',
        attachment: attachment,
        project_id: attachment?.feature?.project_id,
        project: attachment?.feature?.project,
      },
      showHeader: false,
      contentStyle: { padding: '0' },
      style: { overflow: 'hidden' },
      styleClass: 'rounded-sm',
      modal: true,
      dismissableMask: true,
      width: '450px',
    });

    ref.onClose.subscribe((res: any) => {
      if (res) {
        this.attachmentService
          .updateAttachment(this.attachment.id, res)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'success',
                header: 'Success',
                message: res.message,
              });
              this.loadAttachment(this.attachmentId!);
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
    });
  }

  deleteAttachment() {
    const attachment = this.attachment;
    this.deleteAttachmentFile(attachment.id, attachment.file_id);

    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this attachment?',
      accept: () => {
        this.attachmentService.deleteAttachment(attachment.id).subscribe({
          next: (res: any) => {
            this.attachment = null;

            this.fcToastService.add({
              severity: 'success',
              header: 'Success',
              message: res.message,
            });
            this.location.back();
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
    let bodyReq = {
      ...this.feedbackForm.value,
      attachments: [{ attachment_id: Number(this.attachmentId) }],
    };

    this.loading = true;

    this.feedbackService.addFeedback(bodyReq).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'success',
          header: 'Success',
          message: res.message,
        });
        this.feedbackForm.reset();
        this.loadFeedbacks(this.attachmentId!);
      },
      error: (err: any) => {
        this.loading = false;
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'error',
          header: 'Error',
          message: err.message,
        });
      },
    });
  }

  isImage(fileUrl: string): boolean {
    return /\.(jpe?g|png|gif|webp|bmp)$/i.test(fileUrl);
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

  addAtatchmentFile() {
    const ref = this.dialogService.open(AttachmentFileAddDialogComponent, {
      data: {
        title: 'Add Attachment File',
        attachmentId: this.attachmentId,
      },
      showHeader: false,
      contentStyle: { padding: '0' },
      style: { overflow: 'hidden' },
      styleClass: 'rounded-sm',
      modal: true,
      dismissableMask: true,
      width: '450px',
    });
    ref.onClose.subscribe((files: any) => {
      if (files && files.length) {
        if (!this.attachment.attachment_files) {
          this.attachment.attachment_files = [];
        }

        // Loop tiap file di array dan push ke attachment_files
        files.forEach((file: any) => {
          this.attachment.attachment_files.push(file);
        });

        this.cdr.detectChanges();
      }
    });
  }

  deleteAttachmentFile(attachmentId: string, fileId: string) {
    this.fcConfirmationService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this file?',
      accept: () => {
        this.attachmentService
          .deleteAttachmentFile(attachmentId, fileId)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Success',
                message: res.message,
              });
              this.loadAttachment(this.attachmentId!);
              this.loadFeedbacks(this.attachmentId!);
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

  refreshAttachment() {
    if (this.attachmentId) {
      this.loadAttachment(this.attachmentId);
    }
  }

  refreshFeedback() {
    if (this.attachmentId) {
      this.loadFeedbacks(this.attachmentId);
    }
  }
}
