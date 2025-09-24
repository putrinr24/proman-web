import { Injectable } from '@angular/core';
import moment from 'moment';
import {
  FcFilterConfig,
  FilterDate,
  FilterRange,
} from '../interfaces/fc-filter-config';

@Injectable({
  providedIn: 'root',
})
export class FcFilterDialogService {
  constructor() {}

  public getFilterString(fcFilterConfig: FcFilterConfig): string {
    let filterString = '';
    fcFilterConfig.filterFields?.map((field: any, index: number) => {
      if (field.value) {
        if (index == 0) {
          filterString += `${field.name}=${field.value}`;
        } else {
          filterString += `&${field.name}=${field.value}`;
        }
      }
    });
    fcFilterConfig.filterOptions?.map((option: any, index: number) => {
      if (option.selectedValue != null) {
        if (index == 0 || !filterString) {
          filterString += `${option.optionValue}=${option.selectedValue}`;
        } else {
          filterString += `&${option.optionValue}=${option.selectedValue}`;
        }
      }
    });
    if (filterString) {
      filterString += `&with_filter=1`;
    }
    return filterString;
  }
  public getSortString(fcFilterConfig: FcFilterConfig): string {
    let sort = '';
    if (fcFilterConfig.sort) {
      sort += `order_by=${fcFilterConfig.sort.selectedField}&direction=${fcFilterConfig.sort.direction}`;
    }
    return sort;
  }
  public getFilterRangeByFieldString(fcFilterConfig: FcFilterConfig): string {
    let filterRange = '';
    fcFilterConfig.filterRanges?.map(
      (filterRangeField: FilterRange, i: number) => {
        if (filterRangeField.isActive) {
          if (!filterRange) {
            filterRange += `filter_range_start[${i}]=${filterRangeField.start}&filter_range_end[${i}]=${filterRangeField.end}&filter_range_field[${i}]=${filterRangeField.field}`;
          } else {
            filterRange += `&filter_range_start[${i}]=${filterRangeField.start}&filter_range_end[${i}]=${filterRangeField.end}&filter_range_field[${i}]=${filterRangeField.field}`;
          }
        }
      }
    );
    return filterRange;
  }
  public getFilterRangeByDateString(
    fcFilterConfig: FcFilterConfig,
    key?: string
  ): string {
    let filterRangeDate = '';
    fcFilterConfig.filterDates?.map((filterDate: FilterDate, i: number) => {
      if (filterDate.isActive) {
        let filterDateStart = moment(filterDate.start)
          .startOf('day')
          .utc()
          .format();
        let filterDateEnd = moment(filterDate.end).endOf('day').utc().format();

        filterRangeDate += `&filter_date_start[${i}]=${filterDateStart}&filter_date_end[${i}]=${filterDateEnd}&filter_date_field[${i}]=${key ? key + '-' : ''}${filterDate.field}`;
      }
    });
    return filterRangeDate.slice(1);
  }
}
