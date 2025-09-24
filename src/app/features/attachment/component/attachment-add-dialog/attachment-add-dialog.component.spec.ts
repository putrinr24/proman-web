import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentAddDialogComponent } from './attachment-add-dialog.component';

describe('AttachmentAddDialogComponent', () => {
  let component: AttachmentAddDialogComponent;
  let fixture: ComponentFixture<AttachmentAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
