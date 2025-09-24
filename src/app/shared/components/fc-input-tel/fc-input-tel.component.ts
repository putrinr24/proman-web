import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import {
  faCheckCircle,
  faChevronDown,
  faComments,
  faSearch,
  faTimes,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import CountryCodeList from 'src/assets/country-code.json';
import { UniqueComponentId } from '../fc-toast/uniquecomponentid';

@Component({
  selector: 'fc-input-tel',
  templateUrl: './fc-input-tel.component.html',
  styleUrls: ['./fc-input-tel.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FcInputTelComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: FcInputTelComponent,
      multi: true,
    },
  ],
})
export class FcInputTelComponent {
  faChevronDown = faChevronDown;
  faTimesCircle = faTimesCircle;
  faCheckCircle = faCheckCircle;
  faComments = faComments;
  faTimes = faTimes;
  faSearch = faSearch;

  @Input() value: string = '';
  @Input() title = 'Title';
  @Input() placeholder = '';
  @Input() type = 'tel';
  @Input() inputId = 'textInput';
  @Input() isInvalid: boolean | undefined = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required = false;
  @Input() uniqueId = UniqueComponentId();

  @Output() onRemove = new EventEmitter<any>();

  countryCode: string = '62';
  countryName: string = 'Indonesia';
  countryCodeList = CountryCodeList.data;
  searchQuery = '';

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {}
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
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

  writeValue(value: any) {
    this.value = value;
    if (this.value != null || this.value != undefined) {
      this.setCountrycode();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  onValueChange(val: any) {
    this.value = val;
    this.onChange(this.countryCode + this.value);
    this.onTouch(this.countryCode + this.value);
  }

  onRemoveValue() {
    this.onValueChange(null);
    this.onRemove.emit(null);
  }

  setCountrycode() {
    this.countryCodeList.find((x: any) => {
      if (this.value.startsWith(x.dial_code)) {
        let newValue = this.value.replace(x.dial_code, '');
        this.value = newValue;
        this.onChangeCountryCode(x);
        return true;
      }
      return false;
    });
  }

  onChangeCountryCode(countryCode: any) {
    this.countryCode = countryCode.dial_code;
    this.countryName = countryCode.name;
    this.onValueChange(this.value);
  }

  onSearchQueryChange() {
    this.countryCodeList = CountryCodeList.data.filter((x: any) => {
      return (
        x.dial_code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        x.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        x.code.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

  validateNumber(event: any) {
    return Boolean(event.key.match(/^[0-9]*$/));
  }
}
