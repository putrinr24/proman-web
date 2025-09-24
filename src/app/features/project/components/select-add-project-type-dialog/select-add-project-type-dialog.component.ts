import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-select-add-project-type-dialog',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './select-add-project-type-dialog.component.html',
  styleUrl: './select-add-project-type-dialog.component.css',
})
export class SelectAddProjectTypeDialogComponent {
  title = 'Select Project Type';
  faTimes = faTimes;

  constructor(
    private ref: DynamicDialogRef,
    private router: Router
  ) {}

  chooseNew() {
    this.ref.close({ mode: 'new' }); // atau langsung navigate kalau tidak pakai ref
    this.router.navigate(['/project/add']);
  }

  goToTemplateList() {
    this.onClose();
    this.router.navigate(['/template/list']);
  }

  onClose() {
    this.ref.close();
  }
}
