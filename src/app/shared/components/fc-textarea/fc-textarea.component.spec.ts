import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcTextareaComponent } from './fc-textarea.component';

describe('FcTextareaComponent', () => {
  let component: FcTextareaComponent;
  let fixture: ComponentFixture<FcTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcTextareaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
