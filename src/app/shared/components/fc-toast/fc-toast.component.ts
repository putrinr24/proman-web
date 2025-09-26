import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { faEllipsisVertical, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcToast } from './fc-toast';
import { UniqueComponentId } from './uniquecomponentid';
import { Subscription } from 'rxjs';
import { FcToastService } from './fc-toast.service';

@Component({
  selector: 'fc-toast',
  templateUrl: './fc-toast.component.html',
  styleUrl: './fc-toast.component.css',
  standalone: false,
})
export class FcToastComponent {
  faTimes = faTimes;
  faEllipsisVertical = faEllipsisVertical;
  showConfirmation = false;

  confirmationToast: FcToast = {
    id: UniqueComponentId(),
    header: 'Confirmation Toast',
    subheader: 'Subheader',
    message: 'Toast Message',
    showed: true,
    type: 'confirmation',
  };

  @Input() key?: string;
  toasts: FcToast[] = [];
  toastArchieve: FcToast[] = [];
  @Input() preventDuplicates: boolean = false;
  @Input() preventOpenDuplicates: boolean = false;

  toastSubscription: Subscription;
  clearSubscription: Subscription;
  isShowAllItem = false;

  constructor(
    private fcToatsService: FcToastService,
    private cd: ChangeDetectorRef
  ) {
    this.toastSubscription = this.fcToatsService.messageObserver.subscribe(
      (toast) => {
        if (toast) {
          if (toast instanceof Array) {
            const filteredMessages = toast.filter((m) => this.canAdd(m));
            this.add(filteredMessages);
          } else if (this.canAdd(toast)) {
            // set default lottie options by severity
            if (toast.severity) {
              if (!toast.lottieOption) {
                toast.lottieOption = {
                  path: `./assets/images/lotties/${toast.severity}.json`,
                  loop: false,
                };
              }
            }
            this.add([toast]);
          }
        }
      }
    );

    this.clearSubscription = this.fcToatsService.clearObserver.subscribe(
      (key) => {
        if (key) {
          if (this.key === key) {
            this.toasts = [];
          }
        } else {
          this.toasts = [];
        }

        this.cd.markForCheck();
      }
    );
  }

  canAdd(toast: FcToast): boolean {
    let allow = this.key === toast.key;

    if (allow && this.preventOpenDuplicates) {
      allow = !this.containsMessage(this.toasts, toast);
    }

    if (allow && this.preventDuplicates) {
      allow = !this.containsMessage(this.toastArchieve, toast);
    }

    return allow;
  }

  add(toasts: FcToast[]): void {
    this.toasts = this.toasts ? [...toasts, ...this.toasts] : [...toasts];

    if (this.preventDuplicates) {
      this.toastArchieve = this.toastArchieve
        ? [...toasts, ...this.toastArchieve]
        : [...toasts];
    }

    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  containsMessage(collection: FcToast[], message: FcToast): boolean {
    if (!collection) {
      return false;
    }

    return (
      collection.find((m) => {
        return (
          m.header === message.header &&
          m.message === message.message &&
          m.severity === message.severity
        );
      }) != null
    );
  }

  addNewToast() {
    // add to first
    this.toasts.unshift({
      id: UniqueComponentId(),
      header: 'Toast Title',
      subheader: 'Subheader',
      message: 'Toast Message',
      showed: false,
      type: 'static',
    });
    setTimeout(() => {
      this.toasts[0].showed = true;
    }, 100);
  }

  hideToast(item: any) {
    let id = item.id;
    let toastIndex = this.toasts.findIndex((toast) => toast.id === id);
    this.toasts[toastIndex].showed = false;
    setTimeout(() => {
      this.toasts.splice(toastIndex, 1);

      // Reset toggle jika sudah tidak ada toast
      if (this.toasts.length === 0) {
        this.isShowAllItem = false;
      }
      this.cd.detectChanges();
    }, 500);
    this.cd.detectChanges();
  }

  clearAll() {
    let myclearance = setInterval(() => {
      if (this.toastArchieve.length === 0) {
        // break interval
        clearInterval(myclearance);

        // Reset toggle saat sudah clear semua
        this.isShowAllItem = false;
        this.cd.detectChanges();
      } else {
        this.toasts[this.toasts.length - 1].showed = false;
        setTimeout(() => {
          this.toasts.pop();

          // Reset toggle kalau sudah kosong
          if (this.toasts.length === 0) {
            this.isShowAllItem = false;
          }

          this.cd.detectChanges();
        }, 600);
      }
    }, 300);
  }

  toggleMemssage() {
    this.isShowAllItem = !this.isShowAllItem;
  }
}
