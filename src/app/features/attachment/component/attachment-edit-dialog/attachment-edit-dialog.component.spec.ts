import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentEditDialogComponent } from './attachment-edit-dialog.component';

describe('AttachmentEditDialogComponent', () => {
  let component: AttachmentEditDialogComponent;
  let fixture: ComponentFixture<AttachmentEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
