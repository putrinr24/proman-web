import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FcDirtyStateService } from '@core/service/fc-dirty-state.service';
import { AuthService } from '@features/auth/services/auth.service';
import { ProjectSelectDialogComponent } from '@features/project/components/project-select-dialog/project-select-dialog.component';
import { Project } from '@features/project/interfaces/project.interfaces';
import DiscountTypeEnum, {
  getDiscountTypeEnums,
} from '@features/sale-invoice/enums/discount-type-enum';
import { SaleInvoice } from '@features/sale-invoice/interfaces/sale-invoice.interfaces';
import { SalePayment } from '@features/sale-payment/interfaces/sale-payment.interfaces';
import { SaleInvoiceService } from '@features/sale-invoice/services/sale-invoice.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBank,
  faChevronDown,
  faImage,
  faMoneyCheckDollar,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { FcCurrencyPipe } from '@shared/pipes/fc-currency.pipe';
import { SharedModule } from '@shared/shared.module';
import { DialogService } from 'primeng/dynamicdialog';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { SalePaymentService } from '@features/sale-payment/services/sale-payment.service';
import { PaymentHistoryListComponent } from '@features/sale-payment/pages/payment-history-list/payment-history-list.component';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { AnimationItem } from 'lottie-web';
import { LottieComponent } from 'ngx-lottie';
import { TabViewModule } from 'primeng/tabview';

declare global {
  interface Window {
    snap: any;
  }
}

export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

@Component({
  selector: 'app-sale-invoice-view',
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CommonModule,
    TooltipModule,
    TabsModule,
    PaymentHistoryListComponent,
    LottieComponent,
    TabViewModule,
  ],
  templateUrl: './sale-invoice-view.component.html',
  styleUrl: './sale-invoice-view.component.css',
  providers: [DialogService, FcCurrencyPipe, Location],
})
export class SaleInvoiceViewComponent {
  private readonly destroy$ = new Subject<void>();

  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faBank = faBank;
  faMoney = faMoneyCheckDollar;
  faImage = faImage;
  faTrash = faTrash;

  lottieOption = {
    path: '/images/lotties/payment-sucess.json',
    loop: false,
    autoplay: true,
  };
  activeTabIndex: number = 0;

  actionButtons: any[] = [
    {
      id: 1,
      label: 'Refresh',
      icon: '/images/icons/refresh.svg',
      action: () => {
        this.refresh();
      },
      roles: [0, 3],
    },
    {
      id: 2,
      label: 'Delete',
      icon: '/images/icons/trash.svg',
      action: () => {
        this.deleteInvoice(this.saleInvoice.id);
      },
      roles: [0],
    },
  ];

  saleInvoiceForm: FormGroup;

  projects: Project[] = [];
  selectedProject: Project | null = null;

  discountTypes = getDiscountTypeEnums();
  selectedDiscountType: any = null;
  isPercent = false;
  isGrandTotalAllowed: boolean = true;
  maxGrandDiscount!: number;

  authUser: any;

  salePayments: SalePayment[] = [];
  @Input() salePayment: SalePayment = {} as SalePayment;

  @Input() saleInvoice: SaleInvoice = {} as SaleInvoice;
  @Input() required = false;
  @Input() quickView: Boolean = false;

  @Output() onDeleted = new EventEmitter();
  @Output() onUpdated = new EventEmitter();

  paymentMethods!: 'manual' | 'midtrans';
  paymentVisibility!: { showImageUpload: boolean; showMidtrans: boolean };
  pastedImages: { file: File; image_url: string }[] = [];
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  loading = false;
  loadingSubmit = false;

  constructor(
    private location: Location,
    private fcToastService: FcToastService,
    private fcDirtyStateService: FcDirtyStateService,
    private saleInvoiceService: SaleInvoiceService,
    private salePaymentService: SalePaymentService,
    private dialogService: DialogService,
    private fcCurrencyPipe: FcCurrencyPipe,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    private fcConfirmService: FcConfirmService
  ) {
    this.saleInvoice.id = String(this.route.snapshot.paramMap.get('id'));
    this.saleInvoiceForm = new FormGroup({
      invoice_no: new FormControl(null, Validators.required),
      date: new FormControl(new Date(), Validators.required),
      discount_type: new FormControl(null),
      discount_value: new FormControl(0),
      subtotal: new FormControl('', Validators.required),
      status: new FormControl(null, Validators.required),
      project_id: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserData.subscribe((user) => {
      if (user) {
        this.authUser = user;
      }
    });
    this.loadData();

    this.saleInvoiceForm
      .get('discount_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.isPercent = val === DiscountTypeEnum.PERCENTAGE;
        this.maxGrandDiscount = this.isPercent ? 100 : this.remainingAmount;
      });
  }

  ngOnChanges(): void {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isRequired(fieldName: string): boolean {
    const control = this.saleInvoiceForm.get(fieldName);
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

  loadData() {
    this.loading = true;
    this.destroy$.next();
    this.saleInvoiceService
      .getSaleInvoice(this.saleInvoice.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        (this.saleInvoice = { ...res.data }),
          (this.salePayments = this.saleInvoice.sale_payments || []);

        this.saleInvoiceForm.patchValue({
          invoice_no: this.saleInvoice.invoice_no,
          date: this.saleInvoice.date,
          discount_type: this.saleInvoice.discount_type,
          discount_value: this.saleInvoice.discount_value,
          subtotal: this.saleInvoice.subtotal,
          status: this.saleInvoice.status,
          project: this.saleInvoice.project?.id,
        });

        this.selectedProject = res.data.project;
        // Pasang validator subtotal sesuai remaining_amount
        const subtotalCtrl = this.saleInvoiceForm.get('subtotal');
        subtotalCtrl?.setValidators([
          Validators.required,
          this.maxRemainingValidator(this.remainingAmount),
        ]);
        subtotalCtrl?.updateValueAndValidity();

        // Auto potong kalau subtotal > remaining_amount
        const subtotal = subtotalCtrl?.value;
        if (subtotal && subtotal > (this.remainingAmount ?? 0)) {
          subtotalCtrl?.patchValue(this.remainingAmount);
        }
        this.loading = false;
      });
  }

  onSelectProject() {
    const ref = this.dialogService.open(ProjectSelectDialogComponent, {
      data: {
        title: 'Select Project',
        data: this.projects,
      },
      showHeader: false,
      contentStyle: { padding: '0' },
      style: { overflow: 'hidden' },
      styleClass: 'rounded-sm',
      modal: true,
      dismissableMask: true,
      width: '450px',
    });

    ref.onClose.subscribe((project) => {
      if (project) {
        this.selectedProject = project;

        this.saleInvoiceForm.patchValue({
          project_id: project.id,
        });

        const subtotalCtrl = this.saleInvoiceForm.get('subtotal');
        subtotalCtrl?.setValidators([
          Validators.required,
          this.maxRemainingValidator(this.remainingAmount),
        ]);
        subtotalCtrl?.updateValueAndValidity();

        // Auto potong nilai kalau sudah lebih besar
        const subtotal = subtotalCtrl?.value;
        if (subtotal && subtotal > (this.remainingAmount ?? 0)) {
          subtotalCtrl?.patchValue(this.remainingAmount);
        }
      }
    });
  }

  removeProject() {
    this.selectedProject = null;

    // Simpan nilai invoice number, date, dan status sebelum reset
    const currentInvoiceNumber = this.saleInvoiceForm.get('invoice_no')?.value;
    const currentDate = this.saleInvoiceForm.get('date')?.value;
    const currentStatus = this.saleInvoiceForm.get('status')?.value;

    // Reset form tapi pertahankan invoice_no, date, dan status
    this.saleInvoiceForm.reset({
      invoice_no: currentInvoiceNumber,
      date: currentDate,
      status: currentStatus,
      project_id: null,
    });

    // Reset subtotal & discount controls
    this.saleInvoiceForm.get('subtotal')?.disable();
    this.saleInvoiceForm.get('discount_type')?.disable();
    this.saleInvoiceForm.get('discount_value')?.disable();

    // Enable subtotal kalau project sudah dipilih
    this.saleInvoiceForm
      .get('project_id')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((project) => {
        if (project) {
          this.saleInvoiceForm.get('subtotal')?.enable();
        } else {
          this.saleInvoiceForm.get('subtotal')?.disable();
          this.saleInvoiceForm.get('discount_type')?.disable();
          this.saleInvoiceForm.get('discount_value')?.disable();
        }
      });

    // Enable discount type kalau subtotal valid > 0
    this.saleInvoiceForm
      .get('subtotal')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((subtotal) => {
        if (subtotal && subtotal > 0) {
          this.saleInvoiceForm.get('discount_type')?.enable();
        } else {
          this.saleInvoiceForm.get('discount_type')?.disable();
          this.saleInvoiceForm.get('discount_value')?.disable();
        }
      });

    // Enable discount value kalau discount type sudah dipilih
    this.saleInvoiceForm
      .get('discount_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        if (type != null) {
          this.saleInvoiceForm.get('discount_value')?.enable();
        } else {
          this.saleInvoiceForm.get('discount_value')?.disable();
        }
      });

    // Reset validator subtotal
    const subtotalCtrl = this.saleInvoiceForm.get('subtotal');
    subtotalCtrl?.setValidators([Validators.required]);
    subtotalCtrl?.updateValueAndValidity();
  }

  get remainingAmount(): number {
    return this.selectedProject?.remaining_amount ?? 0;
  }

  maxRemainingValidator(max: number | null) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        max === null ||
        control.value === null ||
        control.value === undefined
      ) {
        return null; // Tidak divalidasi kalau tidak ada max
      }
      return control.value > max ? { maxRemaining: true } : null;
    };
  }

  get subTotal(): number {
    return Number(this.saleInvoiceForm.get('subtotal')?.value) || 0;
  }

  setDiscountType() {
    let discountType = this.saleInvoiceForm.get('discount_type')?.value;
    switch (discountType) {
      case 0:
        this.isPercent = true;
        break;
      case 1:
        this.isPercent = false;
        break;
      default:
        break;
    }
  }

  get discountAmount(): number {
    const type = this.saleInvoiceForm.get('discount_type')?.value;
    const value =
      Number(this.saleInvoiceForm.get('discount_value')?.value) || 0;
    const subTotal = this.subTotal;

    if (type === DiscountTypeEnum.PERCENTAGE) {
      return subTotal * (value / 100);
    }
    if (type === DiscountTypeEnum.AMOUNT) {
      return value;
    }
    return 0;
  }

  calculateGrandDiscount() {
    const subTotal = this.subTotal;
    const discount = this.discountAmount;

    const grandTotal = Math.max(subTotal - discount, 0); // prevent negative values
    this.isGrandTotalAllowed = grandTotal >= 0;

    this.saleInvoiceForm.patchValue(
      {
        discount_amount: discount,
        grand_total: grandTotal,
      },
      { emitEvent: false }
    );
  }

  get grandTotal(): number {
    return Math.max(this.subTotal - this.discountAmount, 0);
  }

  submit() {
    this.saleInvoiceForm.patchValue({
      project_id: this.selectedProject?.id || null,
    });

    let bodyReq = JSON.parse(JSON.stringify(this.saleInvoiceForm.value));

    if (this.saleInvoiceForm.invalid) {
      const subtotalCtrl = this.saleInvoiceForm.get('subtotal');
      if (subtotalCtrl?.errors?.['maxRemaining']) {
        const remainingAmount = this.fcCurrencyPipe.transform(
          this.remainingAmount
        );
        this.fcToastService.add({
          severity: 'warning',
          header: 'Warning',
          message: `Subtotal cannot exceed ${remainingAmount}`,
        });
        return;
      }

      this.fcDirtyStateService.checkFormValidation(this.saleInvoiceForm);
      return;
    }

    delete bodyReq.invoice_no;
    delete bodyReq.status;

    this.loading = true;

    if (this.saleInvoiceForm.valid) {
      this.saleInvoiceService
        .updateSaleInvoice(this.saleInvoice.id, bodyReq)
        .subscribe({
          next: (res: any) => {
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'success',
              header: 'Success',
              message: res.message,
            });
            this.onUpdated.emit(res.data);
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

  deleteInvoice(index: string) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this invoice?',
      accept: () => {
        this.saleInvoiceService
          .deleteSaleInvoice(this.saleInvoice.id)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Success',
                message: res.message,
              });
              this.onDeleted.emit(index);
              this.router.navigate(['/sale-invoice/list']);
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

  refresh() {
    this.saleInvoiceForm.reset();
    this.loadData();
    this.pastedImages = [];
  }

  back() {
    this.location.back();
  }

  onSelect(method: string) {
    this.paymentMethods = method as 'manual' | 'midtrans';
    this.paymentVisibility = {
      showImageUpload: method === 'manual',
      showMidtrans: method === 'midtrans',
    };

    if (method === 'manual' && !this.pastedImages) {
      this.pastedImages = [];
    }
  }

  // File handle
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

  // LTV
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

  getButtonColor(status: number): string {
    switch (status) {
      case 0: // pending
        return 'bg-sky-600 hover:bg-sky-700';
      case 1: // partially paid
        return 'bg-orange-600 hover:bg-orange-700';
      case 2: // paid
        return 'bg-green-600 hover:bg-green-700';
      case 3: // cancelled
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  }

  isPayAllowed(isMidtrans: boolean): boolean {
    const total = this.grandTotal;

    if (isMidtrans) {
      console.log(total);
      return total > 0;
    } else {
      return this.pastedImages && this.pastedImages.length > 0 && total > 0;
    }
  }

  get discountDisplay() {
    const type = this.saleInvoiceForm.get('discount_type')?.value;
    const value = this.saleInvoiceForm.get('discount_value')?.value;
    if (type === 0) {
      // return `${value}%`;
      return `${parseFloat(value)}%`;
    } else if (type === 1) {
      return this.fcCurrencyPipe.transform(value); // kalau pakai pipe langsung
    }
    return value;
  }

  isDateValid(date: any) {
    var currentDate = new Date();
    var timeDiff = currentDate.getTime() - date.getTime();
    var oneDayInMillis = 24 * 60 * 60 * 1000;
    return timeDiff < oneDayInMillis;
  }

  onAddAutoConfirmPayment(salePaymentId: number) {
    console.log(this.salePayment);
    console.log(this.salePayment.midtrans_payment.snap_response);
    if (this.salePayment.midtrans_payment.snap_response) {
      this.openSnapToken(this.salePayment.midtrans_payment.snap_response.token);
      // if (
      //   this.isDateValid(new Date(this.salePayment.midtrans_payment.created_at))
      // )
      //  {
      // } else {
      //   this.salePaymentService
      //     .getSnapToken(salePaymentId)
      //     .subscribe((order: any) => {
      //       this.openSnapToken(order.data.midtrans_payment.snap_response.token);
      //     });
      // }
    } else {
      this.salePaymentService
        .getSnapToken(salePaymentId)
        .subscribe((order: any) => {
          this.openSnapToken(order.data.midtrans_payment.snap_response.token);
        });
    }
  }

  openSnapToken(token: string) {
    window.snap.pay(token, {
      onSuccess: (result: any) => {
        this.loadData();
        this.activeTabIndex = 1;
      },
      onPending: (result: any) => {
        this.loadData();
        this.activeTabIndex = 1;
      },
      onError: (result: any) => {
        this.loadData();
        this.activeTabIndex = 1;
      },
      onClose: () => {
        this.loadData();
        this.activeTabIndex = 1;
      },
    });
  }

  showLottie: boolean = false;

  pay() {
    this.loadingSubmit = true;

    const paymentMethodMap = {
      manual: 0,
      midtrans: 1,
    };

    const formData = new FormData();
    formData.append('sale_invoice_id', String(this.saleInvoice.id));
    formData.append('date', new Date().toISOString());
    formData.append(
      'payment_method',
      String(paymentMethodMap[this.paymentMethods])
    );
    formData.append('total', String(this.grandTotal));

    // Append pasted images
    if (this.pastedImages && this.pastedImages.length > 0) {
      this.pastedImages.forEach((image, index) => {
        formData.append('file', image.file); // or 'files[]' if API expects array
      });
    }

    this.salePaymentService.addSalePayment(formData).subscribe({
      next: (res: any) => {
        this.salePayment = res.data;
        if (this.paymentMethods === 'manual') {
          this.showLottie = true;
          setTimeout(() => {
            this.showLottie = false;
            this.fcToastService.add({
              severity: 'success',
              header: 'Success',
              message: 'Payment Success',
            });
            this.loadData();
            this.pastedImages = [];
            (document.activeElement as HTMLElement)?.blur();
            this.activeTabIndex = 1;
          }, 3000);
        } else {
          this.onAddAutoConfirmPayment(res.data);
        }
      },
      error: (err: any) => {
        let messages = '';

        if (Array.isArray(err.response?.message)) {
          messages = err.response.message.join('<br/>');
        } else if (typeof err.response?.message === 'string') {
          messages = err.response.message;
        } else if (err.message) {
          messages = err.message;
        } else {
          messages = 'Unknown error occurred';
        }
        this.fcToastService.add({
          severity: 'error',
          header: 'Payment Failed',
          message: `Failed to submit payment<br/>${messages}`,
        });
      },
      complete: () => {
        this.loadingSubmit = false;
      },
    });
  }

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(1.5);
  }
}
