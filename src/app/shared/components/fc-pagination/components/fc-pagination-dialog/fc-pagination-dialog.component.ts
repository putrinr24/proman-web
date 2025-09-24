import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'fc-fc-pagination-dialog',
  templateUrl: './fc-pagination-dialog.component.html',
  styleUrls: ['./fc-pagination-dialog.component.css'],
  standalone: false
})
export class FcPaginationDialogComponent implements OnInit {
  faTimes = faTimes;

  itemPerPage: number = 0;
  curPage: number = 1;
  totalPages: number = 1;
  title: any;
  itemPerPageOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
    this.itemPerPage = this.config.data.rows;
    this.curPage = this.config.data.curPage;
    this.totalPages = this.config.data.totalPages;
  }

  ngOnInit(): void {}
  submit() {
    let data = {
      rows: this.itemPerPage,
      curPage: this.curPage,
    };
    this.ref.close(data);
  }

  onClose() {
    this.ref.close();
  }
}
