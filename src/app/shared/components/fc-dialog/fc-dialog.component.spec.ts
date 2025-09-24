import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcDialogComponent } from './fc-dialog.component';

describe('FcDialogComponent', () => {
  let component: FcDialogComponent;
  let fixture: ComponentFixture<FcDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
