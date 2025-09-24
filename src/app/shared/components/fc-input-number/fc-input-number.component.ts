import { Component, forwardRef, Input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import {
  faCheckCircle,
  faChevronDown,
  faTimes,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { UniqueComponentId } from '../fc-toast/uniquecomponentid';

@Component({
  selector: 'fc-input-number',
  templateUrl: './fc-input-number.component.html',
  styleUrl: './fc-input-number.component.css',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FcInputNumberComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: FcInputNumberComponent,
      multi: true,
    },
  ],
})
export class FcInputNumberComponent implements ControlValueAccessor {
  faChevronDown = faChevronDown;
  faTimesCircle = faTimesCircle;
  faCheckCircle = faCheckCircle;
  faTimes = faTimes;

  @Input() value = 0;
  @Input() currency = false;
  @Input() currencyOptions: any;
  @Input() title = '';
  @Input() placeholder = '';
  @Input() min = 0;
  @Input() max: number | null = 99999999999999999999999999999999999999;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() uniqueId = UniqueComponentId();
  @Input() required = false;
  @Input() isInvalid: boolean | undefined = false;

  fcNumber: any;
  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {}

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    // check if the input required
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && validator['required']) {
        this.required = true;
      }
    }
    if (control) {
      setTimeout(() => {
        this.isInvalid = control.invalid && control.touched;
      }, 1);
    }
    return null;
  }

  ngOnInit() {
    if (this.currencyOptions === undefined) {
      this.currencyOptions = {
        prefix: '',
        thousands: '.',
        precision: 0,
        align: 'left',
      };
    }
    if (this.currency) {
      this.currencyOptions = {
        ...this.currencyOptions,
        prefix: 'Rp',
        thousands: '.',
        precision: 0,
        nullable: true,
      };
    }
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onRemoveValue() {
    this.onValueChange(null);
  }

  onValueChange(val: any) {
    if (val !== undefined) {
      this.value = val;
      this.onChange(this.value);
      this.onTouch(this.value);
    }
  }
}
