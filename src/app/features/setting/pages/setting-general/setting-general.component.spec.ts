import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingGeneralComponent } from './setting-general.component';

describe('SettingGeneralComponent', () => {
  let component: SettingGeneralComponent;
  let fixture: ComponentFixture<SettingGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
