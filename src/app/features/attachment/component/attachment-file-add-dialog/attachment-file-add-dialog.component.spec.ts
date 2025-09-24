import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentFileAddDialogComponent } from './attachment-file-add-dialog.component';

describe('AttachmentFileAddDialogComponent', () => {
  let component: AttachmentFileAddDialogComponent;
  let fixture: ComponentFixture<AttachmentFileAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentFileAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentFileAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
