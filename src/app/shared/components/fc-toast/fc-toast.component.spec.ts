import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcToastComponent } from './fc-toast.component';

describe('FcToastComponent', () => {
  let component: FcToastComponent;
  let fixture: ComponentFixture<FcToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcToastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
