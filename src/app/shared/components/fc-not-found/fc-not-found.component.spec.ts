import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcNotFoundComponent } from './fc-not-found.component';

describe('FcNotFoundComponent', () => {
  let component: FcNotFoundComponent;
  let fixture: ComponentFixture<FcNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcNotFoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
