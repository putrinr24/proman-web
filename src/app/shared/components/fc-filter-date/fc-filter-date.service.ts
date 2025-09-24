import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class FcFilterDateService {
  constructor() {}

  getPresetDate(preset: number) {
    let tmpDate = new Date();
    let today = new Date();

    let dateRange: any = {
      start: null,
      end: null,
    };
    switch (preset) {
      case 0:
        dateRange.start = today;
        dateRange.end = dateRange.start;
        break;
      case 1:
        dateRange.start = new Date(tmpDate.setDate(tmpDate.getDate() - 1));
        dateRange.end = dateRange.start;
        break;
      case 2:
        dateRange.start = new Date(tmpDate.setDate(tmpDate.getDate() - 7));
        dateRange.end = today;
        break;
      case 3:
        dateRange.start = new Date(tmpDate.setDate(tmpDate.getDate() - 14));
        dateRange.end = today;
        break;
      case 4:
        dateRange.start = new Date(tmpDate.setDate(tmpDate.getDate() - 30));
        dateRange.end = today;
        break;
      case 5:
        var first = tmpDate.getDate() - tmpDate.getDay();
        dateRange.start = new Date(tmpDate.setDate(first));
        dateRange.end = new Date(tmpDate.setDate(tmpDate.getDate() + 6));
        break;
      case 6:
        var first = tmpDate.getDate() - tmpDate.getDay() - 7;
        dateRange.start = new Date(tmpDate.setDate(first));
        dateRange.end = new Date(tmpDate.setDate(tmpDate.getDate() + 6));
        break;
      case 7:
        dateRange.start = new Date(
          tmpDate.getFullYear(),
          tmpDate.getMonth(),
          1
        );
        dateRange.end = new Date(
          tmpDate.getFullYear(),
          tmpDate.getMonth() + 1,
          0
        );
        break;
      case 8:
        dateRange.start = new Date(
          tmpDate.getFullYear(),
          tmpDate.getMonth() - 1,
          1
        );
        dateRange.end = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), 0);
        break;
      case 99:
        dateRange.start = new Date(1970, 1, 1);
        dateRange.end = new Date(tmpDate.getFullYear() + 10, 1, 1);
        break;
      default:
        break;
    }

    dateRange.start = moment(dateRange.start).startOf('day').toDate();
    dateRange.end = moment(dateRange.end).endOf('day').toDate();
    return dateRange;
  }
}
