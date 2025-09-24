import { Routes } from '@angular/router';
import { SettingComponent } from './setting.component';
import { SettingGeneralComponent } from './pages/setting-general/setting-general.component';
import { SettingFormComponent } from './pages/setting-form/setting-form.component';
import { SettingAutoNumberComponent } from './pages/setting-auto-number/setting-auto-number.component';

export const settingRoutes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full',
      },
      {
        path: 'general',
        component: SettingGeneralComponent,
      },
      {
        path: 'form',
        component: SettingFormComponent,
      },
      {
        path: 'auto-number',
        component: SettingAutoNumberComponent,
      },
    ],
  },
];
