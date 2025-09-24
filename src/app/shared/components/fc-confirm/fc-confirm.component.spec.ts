import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcConfirmComponent } from './fc-confirm.component';

describe('FcConfirmComponent', () => {
  let component: FcConfirmComponent;
  let fixture: ComponentFixture<FcConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
