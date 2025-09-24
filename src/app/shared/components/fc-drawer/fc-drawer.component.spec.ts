import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcDrawerComponent } from './fc-drawer.component';

describe('FcDrawerComponent', () => {
  let component: FcDrawerComponent;
  let fixture: ComponentFixture<FcDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
