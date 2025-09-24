import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAddProjectTypeDialogComponent } from './select-add-project-type-dialog.component';

describe('SelectAddProjectTypeDialogComponent', () => {
  let component: SelectAddProjectTypeDialogComponent;
  let fixture: ComponentFixture<SelectAddProjectTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAddProjectTypeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAddProjectTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
