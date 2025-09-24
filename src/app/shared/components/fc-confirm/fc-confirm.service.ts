import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FcConfirm } from './fc-confirm.interface';

@Injectable({
  providedIn: 'root',
})
export class FcConfirmService {
  private messageSource = new Subject<FcConfirm>();
  private clearSource = new Subject<string | null>();

  constructor() {}

  messageObserver = this.messageSource.asObservable();
  clearObserver = this.clearSource.asObservable();

  open(confirm: FcConfirm) {
    if (confirm) {
      this.messageSource.next(confirm);
    }
  }

  clear(key?: string) {
    this.clearSource.next(key || null);
  }
}
