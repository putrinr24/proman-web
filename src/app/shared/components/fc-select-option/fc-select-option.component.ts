import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import {
  faChevronDown,
  faSearch,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'fc-select-option',
  templateUrl: './fc-select-option.component.html',
  styleUrls: ['./fc-select-option.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FcSelectOptionComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FcSelectOptionComponent,
    },
  ],
})
export class FcSelectOptionComponent implements ControlValueAccessor {
  faChevronDown = faChevronDown;
  faTimes = faTimes;
  faSearch = faSearch;
  showModal = false;
  value = null;

  @Input() isInvalid: boolean | undefined = false;
  @Input() title = '';
  @Input() desktopView = 'modal';
  @Input() mobileView = 'modal';
  @Input() options: any = [];
  @Input() optionLabel = '';
  @Input() optionValue = '';
  @Input() pagination = false;
  @Input() hideCloseButton = false;
  @Input() searchable = false;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onRemove: EventEmitter<any> = new EventEmitter();

  onChange: any = () => {};
  onTouch: any = () => {};
  valueLabel = '';
  searchQuery = '';

  ngOnChanges() {
    this.writeValue(this.value);
  }

  writeValue(value: any) {
    this.value = value;
    if (value != null) {
      let selectedOption = this.options.find((x: any) => {
        if (this.optionValue != '') {
          return x[this.optionValue] == this.value;
        } else {
          return JSON.stringify(x) == JSON.stringify(this.value);
        }
      });
      if (selectedOption) {
        this.valueLabel = selectedOption[this.optionLabel];
      }
    }
  }

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
    this.onRemove.emit(null);
  }

  onValueChange(val: any) {
    if (val !== null && this.value !== val) {
      this.value = this.optionValue != '' ? val[this.optionValue] : val;
      this.valueLabel = val[this.optionLabel];
      this.onChange(this.value);
      this.onTouch(this.value);
      let selectedOption = this.options.find((x: any) => {
        if (this.optionValue != '') {
          return x[this.optionValue] == this.value;
        } else {
          return x == this.value;
        }
      });
      this.onSelect.emit(selectedOption);
    } else if (this.value == val) {
    } else {
      this.value = null;
      this.valueLabel = '';
      this.onChange(this.value);
      this.onTouch(this.value);
      this.onSelect.emit(null);
    }
  }

  get showableOptions() {
    if (this.searchQuery) {
      let filteredOptions = this.options.filter((x: any) =>
        x[this.optionLabel]
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
      return filteredOptions;
    }
    return this.options;
  }
}
