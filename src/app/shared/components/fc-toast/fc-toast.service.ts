import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FcToast } from './fc-toast';

@Injectable({
  providedIn: 'root',
})
export class FcToastService {
  private messageSource = new Subject<FcToast | FcToast[]>();
  private clearSource = new Subject<string | null>();

  messageObserver = this.messageSource.asObservable();
  clearObserver = this.clearSource.asObservable();

  add(toast: FcToast) {
    if (toast) {
      this.messageSource.next(toast);
    }
  }

  addAll(toasts: FcToast[]) {
    if (toasts && toasts.length) {
      this.messageSource.next(toasts);
    }
  }

  clear(key?: string) {
    this.clearSource.next(key || null);
  }
}
