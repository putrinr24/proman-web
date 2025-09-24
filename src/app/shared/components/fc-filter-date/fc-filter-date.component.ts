import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FcFilterDateService } from './fc-filter-date.service';

@Component({
  selector: 'fc-filter-date',
  templateUrl: './fc-filter-date.component.html',
  styleUrls: ['./fc-filter-date.component.css'],
  standalone: false,
})
export class FcFilterDateComponent implements OnInit {
  presetDates = [
    { label: 'Hari ini', value: 0 },
    { label: 'Kemarin', value: 1 },
    { label: 'Dalam 7 hari', value: 2 },
    { label: 'Dalam 14 hari', value: 3 },
    { label: 'Dalam 30 hari', value: 4 },
    { label: 'Minggu ini', value: 5 },
    { label: 'Minggu lalu', value: 6 },
    { label: 'Bulan ini', value: 7 },
    { label: 'Bulan lalu', value: 8 },
    { label: 'Maksimal', value: 99 },
  ];
  selectionDates: any;
  @Input() filterDateRange: any = {
    start: null,
    end: null,
    field: null,
  };

  @Output() onSelectDate: EventEmitter<any> = new EventEmitter();

  faCalendarDay = faCalendarDay;
  constructor(private fcFilterDateService: FcFilterDateService) {}

  ngOnInit(): void {
    this.setDefaultDate();
  }
  onDateChanged() {
    this.onSelectDate.emit(this.filterDateRange);
  }
  //  Date
  setDefaultDate() {
    this.selectionDates = [
      this.filterDateRange.start,
      this.filterDateRange.end,
    ];
  }
  setDate() {
    this.filterDateRange.start = this.selectionDates[0];
    if (!this.selectionDates[1]) {
      this.filterDateRange.end = this.selectionDates[0];
    } else {
      this.filterDateRange.end = this.selectionDates[1];
    }
    this.onDateChanged();
  }

  datePreset(preset: number) {
    let selectedDatePreset = this.fcFilterDateService.getPresetDate(preset);
    this.filterDateRange.start = selectedDatePreset.start;
    this.filterDateRange.end = selectedDatePreset.end;
    this.resetDate();
    this.onDateChanged();
  }
  resetDate() {
    this.selectionDates[0] = this.filterDateRange.start;
    this.selectionDates[1] = this.filterDateRange.end;
  }
}
