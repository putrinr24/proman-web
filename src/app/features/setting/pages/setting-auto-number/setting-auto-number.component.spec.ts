import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingAutoNumberComponent } from './setting-auto-number.component';

describe('SettingAutoNumberComponent', () => {
  let component: SettingAutoNumberComponent;
  let fixture: ComponentFixture<SettingAutoNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingAutoNumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingAutoNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
