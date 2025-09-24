import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSelectDialogComponent } from './project-select-dialog.component';

describe('ProjectSelectDialogComponent', () => {
  let component: ProjectSelectDialogComponent;
  let fixture: ComponentFixture<ProjectSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSelectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
