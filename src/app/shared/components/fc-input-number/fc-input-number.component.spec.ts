import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcInputNumberComponent } from './fc-input-number.component';

describe('FcInputNumberComponent', () => {
  let component: FcInputNumberComponent;
  let fixture: ComponentFixture<FcInputNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcInputNumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcInputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
