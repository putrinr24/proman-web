import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcSvgLoaderComponent } from './fc-svg-loader.component';

describe('FcSvgLoaderComponent', () => {
  let component: FcSvgLoaderComponent;
  let fixture: ComponentFixture<FcSvgLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcSvgLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcSvgLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
