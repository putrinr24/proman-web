import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FcDirtyStateService } from '@core/service/fc-dirty-state.service';
import { ProjectSelectDialogComponent } from '@features/project/components/project-select-dialog/project-select-dialog.component';
import { Project } from '@features/project/interfaces/project.interfaces';
import { SaleInvoiceService } from '@features/sale-invoice/services/sale-invoice.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBank,
  faChevronDown,
  faMoneyCheckDollar,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { SharedModule } from '@shared/shared.module';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import DiscountTypeEnum, {
  getDiscountTypeEnums,
} from '@features/sale-invoice/enums/discount-type-enum';
import { FcCurrencyPipe } from '@shared/pipes/fc-currency.pipe';

@Component({
  selector: 'app-sale-invoice-add',
  imports: [SharedModule, ReactiveFormsModule, FontAwesomeModule, CommonModule],
  templateUrl: './sale-invoice-add.component.html',
  styleUrl: './sale-invoice-add.component.css',
  providers: [DialogService, FcCurrencyPipe],
})
export class SaleInvoiceAddComponent {
  private readonly destroy$ = new Subject<void>();

  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faBank = faBank;
  faAmount = faMoneyCheckDollar;

  saleInvoiceForm: FormGroup;
  projects: Project[] = [];
  selectedProject: Project | null = null;
  selectedDiscountType: any = null;
  discountTypes = getDiscountTypeEnums();
  isPercent = false;
  isGrandTotalAllowed: boolean = true;
  maxGrandDiscount!: number;

  loading = false;
  @Input() required = false;

  constructor(
    private location: Location,
    private fcToastService: FcToastService,
    private fcDirtyStateService: FcDirtyStateService,
    private saleInvoiceService: SaleInvoiceService,
    private dialogService: DialogService,
    private fcCurrencyPipe: FcCurrencyPipe
  ) {
    this.saleInvoiceForm = new FormGroup({
      date: new FormControl(new Date(), Validators.required),
      discount_type: new FormControl(null),
      discount_value: new FormControl(0),
      subtotal: new FormControl('', Validators.required),
      status: new FormControl(0, Validators.required),
      project_id: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    // Awalnya semua disable kecuali date & project
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

    // Logic lama untuk set isPercent & maxGrandDiscount
    this.saleInvoiceForm
      .get('discount_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.isPercent = val === DiscountTypeEnum.PERCENTAGE;
        this.maxGrandDiscount = this.isPercent ? 100 : this.remainingAmount;
      });
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
    this.saleInvoiceForm.patchValue({ project_id: null });

    const subtotalCtrl = this.saleInvoiceForm.get('subtotal');
    subtotalCtrl?.setValidators([Validators.required]); // hapus batas max
    subtotalCtrl?.updateValueAndValidity();

    // Simpan nilai date & status sebelum reset
    const currentDate = this.saleInvoiceForm.get('date')?.value;
    const currentStatus = this.saleInvoiceForm.get('status')?.value;

    // Reset form
    this.saleInvoiceForm.reset();

    // Kembalikan nilai date & status
    this.saleInvoiceForm.patchValue({
      date: currentDate,
      status: currentStatus,
    });
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
    let bodyReq = JSON.parse(JSON.stringify(this.saleInvoiceForm.value)); // deep copy

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
          life: 5000,
        });
        return;
      }

      this.fcDirtyStateService.checkFormValidation(this.saleInvoiceForm);
      return;
    }

    if (bodyReq.discount_type == null) {
      delete bodyReq.discount_type;
      delete bodyReq.discount_value;
    }

    delete bodyReq.status;

    this.loading = true;

    this.saleInvoiceService.addSaleInvoice(bodyReq).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.fcToastService.add({
          severity: 'success',
          header: 'Success',
          message: res.message,
        });
        this.location.back();
      },
      error: (err) => {
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

  back() {
    this.location.back();
  }
}
