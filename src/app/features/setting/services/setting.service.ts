import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private settingConfig: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {
    // check on local storage
    const settingConfig = localStorage.getItem('settingConfig');
    if (settingConfig) {
      this.settingConfig.next(JSON.parse(settingConfig));
    } else {
      this.settingConfig.next({
        generalConfig: {},
        formConfig: {},
        appScale: '1',
      });
      // save to local storage
      localStorage.setItem(
        'settingConfig',
        JSON.stringify(this.settingConfig.getValue())
      );
    }
  }

  get settingConfig$() {
    return this.settingConfig.asObservable();
  }

  updateSettingConfig(config: any) {
    const currentConfig = this.settingConfig.getValue();
    const updateSettingConfig = {
      ...currentConfig,
      ...config,
    };
    this.settingConfig.next(updateSettingConfig);
    localStorage.setItem('settingConfig', JSON.stringify(updateSettingConfig));
  }
}
