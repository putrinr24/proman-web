import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  AbstractControl,
  ValidationErrors,
  ControlValueAccessor,
  Validator,
} from '@angular/forms';
import {
  faCheckCircle,
  faChevronDown,
  faTimes,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { UniqueComponentId } from '../fc-toast/uniquecomponentid';

@Component({
  selector: 'fc-textarea',
  templateUrl: './fc-textarea.component.html',
  styleUrl: './fc-textarea.component.css',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FcTextareaComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FcTextareaComponent,
    },
  ],
})
export class FcTextareaComponent implements ControlValueAccessor, Validator {
  faChevronDown = faChevronDown;
  faTimesCircle = faTimesCircle;
  faCheckCircle = faCheckCircle;
  faTimes = faTimes;

  @Input() value: string = '';
  @Input() title = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() isInvalid: boolean | undefined = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Output() onRemove = new EventEmitter<any>();
  @Input() uniqueId = UniqueComponentId();
  @Input() required = false;
  @Input() rows = 1;

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
}
