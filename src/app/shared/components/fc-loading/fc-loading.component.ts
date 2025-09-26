import { Component, Input } from '@angular/core';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'fc-loading',
  templateUrl: './fc-loading.component.html',
  styleUrls: ['./fc-loading.component.css'],
  standalone: false,
})
export class FcLoadingComponent {
  lottieOption = {
    path: `/assets/images/lotties/loading.json`,
    loop: true,
  };
  @Input() mode = 'normal';
  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(1.5);
  }
}
