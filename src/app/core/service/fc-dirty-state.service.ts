import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FcDirtyStateService {
  state: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private fcToastService: FcToastService) {}
  public get getCurrentState() {
    return this.state;
  }

  setState(state: boolean) {
    return this.state.next(state);
  }

  checkFormValidation(formGroup: FormGroup) {
    formGroup.markAllAsTouched();
    let errorFields: any = [];
    // update all form control validation status
    Object.keys(formGroup.controls).forEach((key) => {
      formGroup.controls[key].updateValueAndValidity();
      if (formGroup.controls[key].invalid) {
        errorFields.push({
          label: key,
          value: formGroup.controls[key].errors,
        });
      }
    });
    // error message
    let messagError = '';
    errorFields.forEach((element: any) => {
      element.label = element.label.replace('_', ' ');
      // title case
      element.label = element.label
        .toLowerCase()
        .split(' ')
        .map(function (word: string) {
          return word.replace(word[0], word[0].toUpperCase());
        })
        .join(' ');
      if (element.value.required) {
        messagError += element.label + ' is required, ';
      }
      if (element.value.email) {
        messagError += element.label + ' is not valid email, ';
      }
      if (element.value.minlength) {
        messagError +=
          element.label +
          ' minimum length is ' +
          element.value.minlength.requiredLength +
          ', ';
      }
      if (element.value.maxlength) {
        messagError +=
          element.label +
          ' maximum length is ' +
          element.value.maxlength.requiredLength +
          ', ';
      }
      if (element.value.pattern) {
        messagError += element.label + ' is not valid, ';
      }
    });
    // remove keyword  exact '_id'
    messagError = messagError.replaceAll(' Id ', ' ');

    // remove last comma and change to dot
    messagError = messagError.slice(0, -2) + '.';
    this.fcToastService.clear();
    this.fcToastService.add({
      severity: 'warning',
      header: 'Form Invalid',
      // sticky: true,
      life: 5000,
      message: messagError,
    });
  }
}
