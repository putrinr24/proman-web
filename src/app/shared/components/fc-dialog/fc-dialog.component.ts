import { Component, Input, ViewChild } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { OverlayPanel } from 'primeng/overlaypanel';
import { LayoutService } from '../../../layout/services/layout.service';

@Component({
  selector: 'fc-dialog',
  templateUrl: './fc-dialog.component.html',
  styleUrl: './fc-dialog.component.css',
  standalone: false,
})
export class FcDialogComponent {
  faTimes = faTimes;
  showModal = false;

  @Input() title = 'Title';
  @Input() desktopView = 'modal';
  @Input() mobileView = 'modal';
  @Input() defaultView = 'overlay';

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.layoutService.isMobile$?.subscribe((isMobile) => {
      if (isMobile) {
        this.defaultView = this.mobileView;
      } else {
        this.defaultView = this.desktopView;
      }
    });
  }

  @ViewChild('overlayPanel') overlayPanel: OverlayPanel | undefined;
  toggle(event: any, target: any = null) {
    if (this.overlayPanel) {
      if (this.defaultView == 'overlay') {
        this.overlayPanel.toggle(event, target);
      } else {
        this.showModal = !this.showModal;
      }
    }
  }

  hide() {
    if (this.overlayPanel) {
      this.overlayPanel.hide();
    } else {
      this.showModal = false;
    }
  }
}
