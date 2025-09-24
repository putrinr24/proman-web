import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'fc-drawer',
  templateUrl: './fc-drawer.component.html',
  styleUrl: './fc-drawer.component.css',
  standalone: false,
})
export class FcDrawerComponent implements OnInit, OnDestroy {
  faTimes = faTimes;
  faChevronLeft = faChevronLeft;

  @Input() title = 'Drawer';
  @Input() header = true;
  @Input() isShowDrawer = false;
  @Input() direction = 'right';
  @Input() screen = 'md';
  @Input() clickOutsideToClose = true;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.hide();
  }

  toggle() {
    this.isShowDrawer = !this.isShowDrawer;
    this.isShowDrawer
      ? this.document.body.classList.add('overflow-hidden')
      : this.document.body.classList.remove('overflow-hidden');
  }

  hide() {
    this.isShowDrawer = false;
    this.document.body.classList.remove('overflow-hidden');
  }

  check() {}

  get preAnimation() {
    let animationStyle = '';
    switch (this.direction) {
      case 'bottom':
        animationStyle = '-translate-y-[100vh]';
        break;
      case 'left':
        break;
      case 'top':
        break;
      case 'right':
        break;

      default:
        break;
    }
    return animationStyle;
  }
  get postAnimation() {
    let animationStyle = '';
    switch (this.direction) {
      case 'bottom':
        animationStyle = 'translate-y-0';
        break;
      case 'left':
        break;
      case 'top':
        break;
      case 'right':
        break;

      default:
        break;
    }
    return animationStyle;
  }
}
