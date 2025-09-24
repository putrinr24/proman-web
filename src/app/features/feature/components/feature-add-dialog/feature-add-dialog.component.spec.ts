import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureAddDialogComponent } from './feature-add-dialog.component';

describe('FeatureAddDialogComponent', () => {
  let component: FeatureAddDialogComponent;
  let fixture: ComponentFixture<FeatureAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
