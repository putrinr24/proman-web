import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  faCaretRight,
  faChevronLeft,
  faChevronRight,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { DialogService } from 'primeng/dynamicdialog';
import { FcPaginationDialogComponent } from './components/fc-pagination-dialog/fc-pagination-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'fc-pagination',
  templateUrl: './fc-pagination.component.html',
  styleUrl: './fc-pagination.component.css',
  standalone: false,
})
export class FcPaginationComponent implements OnInit {
  faCaretRight = faCaretRight;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faInfoCircle = faInfoCircle;

  @Input() rows: number = 0;
  @Input() totalRecords: number = 0;
  @Output() onPageUpdate: EventEmitter<any> = new EventEmitter();

  @Input() page: number = 0;
  @Input() totalPages: number = 0;
  @Input() showTotal: boolean = true;

  rowOptions = ['5', '10', '50', '100'];

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}
  updatePage() {
    let pagination = {
      page: this.page,
      rows: this.rows,
    };
    this.onPageUpdate.emit(pagination);
  }
  changePage(selectedPage: number) {
    this.page = selectedPage;
  }
  changeRows(selectedRows: number) {
    this.rows = selectedRows;
  }
  onNextPage() {
    if (Number(this.page) < Number(this.totalPages)) {
      this.changePage(Number(this.page) + 1);
      this.updatePage();
    }
  }
  onPrevPage() {
    if (Number(this.page) > 1) {
      this.changePage(Number(this.page) - 1);
      this.updatePage();
    }
  }
  onOpenPaginationDialog() {
    const ref = this.dialogService.open(FcPaginationDialogComponent, {
      data: {
        title: 'Pagination',
        curPage: this.page,
        totalPages: this.totalPages,
        rows: this.rows,
      },
      showHeader: false,
      contentStyle: {
        padding: '0',
      },
      style: {
        overflow: 'hidden',
      },
      styleClass: 'rounded-sm',
      dismissableMask: true,
      width: '450px',
    });
    ref.onClose.subscribe((data) => {
      if (data) {
        this.changeRows(data.rows);
        this.totalPages =
          this.totalRecords > this.rows
            ? Math.ceil(this.totalRecords / this.rows)
            : 1;
        if (data.curPage > this.totalPages) {
          this.changePage(this.totalPages);
        } else {
          this.changePage(data.curPage);
        }
        this.updatePage();
      }
    });
  }
}
