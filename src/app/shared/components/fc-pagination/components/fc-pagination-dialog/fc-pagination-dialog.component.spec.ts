import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcPaginationDialogComponent } from './fc-pagination-dialog.component';

describe('FcPaginationDialogComponent', () => {
  let component: FcPaginationDialogComponent;
  let fixture: ComponentFixture<FcPaginationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcPaginationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcPaginationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
