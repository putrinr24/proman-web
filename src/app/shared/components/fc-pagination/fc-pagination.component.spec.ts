import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcPaginationComponent } from './fc-pagination.component';

describe('FcPaginationComponent', () => {
  let component: FcPaginationComponent;
  let fixture: ComponentFixture<FcPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcPaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
