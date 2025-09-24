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
  faCalendarDay,
  faChevronDown,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { UniqueComponentId } from '../fc-toast/uniquecomponentid';
import { FcFilterDateService } from '../fc-filter-date/fc-filter-date.service';

@Component({
  selector: 'fc-datepicker',
  templateUrl: './fc-datepicker.component.html',
  styleUrls: ['./fc-datepicker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FcDatepickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: FcDatepickerComponent,
      multi: true,
    },
  ],
  standalone: false,
})
export class FcDatepickerComponent implements ControlValueAccessor {
  faCalendarDay = faCalendarDay;
  faTimes = faTimes;
  faChevronDown = faChevronDown;

  @Input() title = '';

  @Input() type: 'single' | 'range' = 'single';
  @Input() placeholder = 'Select Date';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() hideCloseButton = false;
  @Input() uniqueId = UniqueComponentId();
  @Input() view: 'date' | 'month' | 'year' = 'date';
  @Input() displayType: 'input' | 'chip' = 'input';
  @Input() required = false;
  @Input() isInvalid: boolean | undefined = false;

  presetDates = [
    { label: 'Today', value: 0 },
    { label: 'Yesterday', value: 1 },
    { label: 'Last 7 days', value: 2 },
    { label: 'Last 14 days', value: 3 },
    { label: 'Last 30 days', value: 4 },
    { label: 'This week', value: 5 },
    { label: 'Last week', value: 6 },
    { label: 'This month', value: 7 },
    { label: 'Last month', value: 8 },
    { label: 'Maximum', value: 99 },
  ];

  selectionDates: [Date | null, Date | null] = [null, null];
  displayPresetLabel = '';

  value: any = null;

  onChange: any = () => {};

  onTouch: any = () => {};

  @Output() onSelectDate = new EventEmitter<any>();
  @Output() onRemoveValue = new EventEmitter<any>();

  constructor(private fcFilterDateService: FcFilterDateService) {}

  ngOnInit(): void {}

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

  writeValue(value: any) {
    if (this.type === 'range') {
      this.value = value ?? { start: null, end: null };
      this.selectionDates =
        value?.start && value?.end ? [value.start, value.end] : [null, null];
    } else {
      this.value = value ?? null;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  setDate() {
    this.displayPresetLabel = '';
    if (this.type === 'range') {
      const [start, end] = this.selectionDates;
      this.value = { start, end: end ?? start };
      this.onValueChange(this.value);
    }
  }

  datePreset(preset: number) {
    const selected = this.fcFilterDateService.getPresetDate(preset);
    const presetObj = this.presetDates.find((p) => p.value === preset);
    if (presetObj) {
      this.displayPresetLabel = presetObj.label;
    }

    this.selectionDates = [selected.start, selected.end];
    this.value = { start: selected.start, end: selected.end };
    this.onValueChange(this.value);
  }

  removeValue() {
    this.displayPresetLabel = '';
    if (this.type === 'range') {
      this.value = { start: null, end: null };
      this.selectionDates = [null, null];
    } else {
      this.value = null;
    }
    this.onValueChange(this.value);
    this.onRemoveValue.emit();
  }

  resetDate() {
    this.displayPresetLabel = '';
    if (this.type == 'range') {
      this.selectionDates = [null, null];
    }
  }

  onValueChange(val: any) {
    if (val !== undefined) {
      this.value = val;
      this.onChange(val);
      this.onTouch(val);
      this.onSelectDate.emit(this.value);
    }
  }

  onDatePickerChange(date: any) {
    if (this.type === 'range') {
      this.selectionDates = date;
      this.setDate();
    } else {
      this.value = date;
      this.onValueChange(this.value);
    }
  }
}
