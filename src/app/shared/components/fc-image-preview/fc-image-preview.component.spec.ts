import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcImagePreviewComponent } from './fc-image-preview.component';

describe('FcImagePreviewComponent', () => {
  let component: FcImagePreviewComponent;
  let fixture: ComponentFixture<FcImagePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcImagePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
