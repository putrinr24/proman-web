import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcTableComponent } from './fc-table.component';

describe('FcTableComponent', () => {
  let component: FcTableComponent;
  let fixture: ComponentFixture<FcTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
