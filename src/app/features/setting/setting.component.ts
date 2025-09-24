import { Component } from '@angular/core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { LayoutService } from '../../layout/services/layout.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-setting',
  imports: [CommonModule, RouterModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent {
  faChevronUp = faChevronUp;

  mainMenus: any[] = [
    {
      route: 'general',
      name: 'General',
    },
    {
      route: 'form',
      name: 'Form Setting',
    },
    {
      route: 'auto-number',
      name: 'Auto Number',
    },
  ];

  userConfig: any = {
    showSidebar: true,
    dateInputOptions: {},
    timeInputOptions: {},
    calculatorOptions: {},
    appScale: '1',
  };

  constructor(private layoutService: LayoutService) {
    this.layoutService.setHeaderConfig({
      title: 'Setting',
      icon: '',
      showHeader: true,
    });
  }
}
