import { Component, OnInit } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { SettingService } from '../features/setting/services/setting.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LayoutService } from './services/layout.service';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [
    HeaderComponent,
    CommonModule,
    SharedModule,
    SidebarComponent,
    RouterModule,
  ],
})
export class LayoutComponent implements OnInit {
  faBars = faBars;

  sidebarConfig: any = {
    showSidebar: false,
    hideWhenRouteChange: false,
    overlay: true,
  };

  constructor(
    private settingService: SettingService,
    private router: Router,
    private layoutService: LayoutService
  ) {
    this.settingService.settingConfig$.subscribe((config) => {
      // match with for each
      for (const key in config.generalConfig) {
        if (Object.prototype.hasOwnProperty.call(config.generalConfig, key)) {
          const element = config.generalConfig[key];
          this.sidebarConfig[key] = element;
        }
      }
    });
    // check if sidebar is hidden when route change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.sidebarConfig.hideWhenRouteChange) {
          this.sidebarConfig.showSidebar = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.layoutService.isMobile$.subscribe((isMobile) => {
      this.sidebarConfig.hideWhenRouteChange = isMobile;
      this.sidebarConfig.showSidebar = !isMobile;
    });
  }

  toggleSidebar() {
    this.sidebarConfig.showSidebar = !this.sidebarConfig.showSidebar;
  }
}
