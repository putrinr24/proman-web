import { Component } from '@angular/core';
import { FcConfirm } from './fc-confirm.interface';
import { FcConfirmService } from './fc-confirm.service';

@Component({
  selector: 'fc-confirm',
  templateUrl: './fc-confirm.component.html',
  styleUrls: ['./fc-confirm.component.css'],
  standalone: false,
})
export class FcConfirmComponent {
  showConfirmation = false;
  confirm: FcConfirm = {} as FcConfirm;
  constructor(private fcConfirmService: FcConfirmService) {
    this.fcConfirmService.messageObserver.subscribe((confirm) => {
      if (confirm) {
        this.showConfirmation = true;
        this.confirm = confirm;
      }
    });
  }

  accept() {
    this.fcConfirmService.clear();
  }

  cancel() {
    this.fcConfirmService.clear();
  }
}
