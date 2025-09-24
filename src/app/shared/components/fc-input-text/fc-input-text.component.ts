import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
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
  selector: 'fc-input-text',
  templateUrl: './fc-input-text.component.html',
  styleUrl: './fc-input-text.component.css',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FcInputTextComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: FcInputTextComponent,
      multi: true,
    },
  ],
})
export class FcInputTextComponent implements ControlValueAccessor {
  faChevronDown = faChevronDown;
  faTimesCircle = faTimesCircle;
  faCheckCircle = faCheckCircle;
  faTimes = faTimes;

  @Input() value: string = '';
  @Input() title = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() inputId = 'textInput';
  @Input() isInvalid: boolean | undefined = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() showRemoveButton: boolean = true;
  @Output() onRemove = new EventEmitter<any>();
  @Input() uniqueId = UniqueComponentId();
  @Input() required = false;

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

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  onRemoveValue() {
    this.onValueChange(null);
    this.onRemove.emit(null);
  }

  onValueChange(val: any) {
    if (val !== undefined) {
      this.value = val;
      this.onChange(this.value);
      this.onTouch(this.value);
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
