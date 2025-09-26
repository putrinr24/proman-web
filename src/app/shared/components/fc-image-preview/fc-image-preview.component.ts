import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  faTimes,
  faRefresh,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'fc-image-preview',
  templateUrl: './fc-image-preview.component.html',
  styleUrl: './fc-image-preview.component.css',
  standalone: false,
})
export class FcImagePreviewComponent {
  faTimes = faTimes;
  faRefresh = faRefresh;
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  loading = true;
  isError = false;

  @Input() src: string = '';
  @Input() srcError: string = './assets/images/placeholders/image.png';
  @Input() alt: string = '';
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() actionButtons: any[] = [];
  showPreview = false;
  @Input() preview = false;
  @Output() onClick = new EventEmitter();
  @ViewChild('imageDialog') imageDialog: any;

  loadSuccess() {
    this.loading = false;
  }

  setErrorImg() {
    this.isError = true;
  }

  handleClick() {
    this.onClick.emit();
    if (!this.loading) {
      if (this.isError) {
        this.retry();
      } else {
        if (this.preview) {
          this.showPreview = true;
          this.imageDialog.maximized = true;
        }
      }
    }
  }

  retry() {
    this.isError = false;
  }
}
