import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderConfig } from '../interfaces/header-config.interface';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Ability } from '@casl/ability';
import { User } from '@features/user/interfaces/user';
import { AuthService } from '@features/auth/services/auth.service';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  authUser: User = {} as User;
  isMobileSubject: BehaviorSubject<any>;
  headerConfigSubject = new BehaviorSubject<HeaderConfig>({
    title: '',
    icon: '',
    showHeader: true,
  });

  searchConfigSubject = new BehaviorSubject<any>({
    showSearch: false,
    searchPlaceholder: '',
    searchQuery: '',
    featureName: '',
  });

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private ability: Ability,
    private authService: AuthService
  ) {
    this.isMobileSubject = new BehaviorSubject(
      Boolean(this.deviceType == 'mobile')
    );
    this.authService.getCurrentUserData.subscribe((user) => {
      if (user) {
        this.authUser = user;
      }
    });
  }

  get deviceType(): string {
    if (isPlatformBrowser(this.platformId)) {
      const ua = window.navigator.userAgent;
      if (
        /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          ua
        )
      ) {
        return 'mobile';
      }
      return 'desktop';
    } else {
      return '';
    }
  }

  public get isMobile$() {
    return this.isMobileSubject;
  }

  setHeaderConfig(config: HeaderConfig) {
    this.headerConfigSubject.next({
      ...this.headerConfigSubject.value,
      ...config,
    });
  }

  setSearchConfig(config: any) {
    this.searchConfigSubject.next({
      ...this.searchConfigSubject.value,
      ...config,
    });
  }

  getRoutes() {
    return [
      {
        route: '/dashboard',
        name: 'Dashboard',
        icon: './assets/images/icons/dashboard-menu.svg',
        sequence: 1,
        // visible: [
        //   UserRoleEnum.OWNER,
        //   UserRoleEnum.PROJECT_MANAGER,
        //   UserRoleEnum.DEVELOPER,
        // ].includes(this.authUser.role),
        visible: true,
      },
      {
        route: '/user',
        name: 'User',
        icon: './assets/images/icons/user-menu.svg',
        visible: [UserRoleEnum.OWNER, UserRoleEnum.PROJECT_MANAGER].includes(
          this.authUser.role
        ),
      },
      {
        route: '/project',
        name: 'Project',
        icon: './assets/images/icons/project-menu.svg',
        visible: [
          UserRoleEnum.OWNER,
          UserRoleEnum.PROJECT_MANAGER,
          UserRoleEnum.DEVELOPER,
          UserRoleEnum.CUSTOMER,
        ].includes(this.authUser.role),
      },
      {
        route: '/template',
        name: 'Template',
        icon: './assets/images/icons/template-menu.svg',
        visible: [UserRoleEnum.OWNER, UserRoleEnum.PROJECT_MANAGER].includes(
          this.authUser.role
        ),
      },
      {
        route: '/sale-invoice',
        name: 'Sale Invoice',
        icon: './assets/images/icons/invoice-menu.svg',
        visible: [UserRoleEnum.OWNER, UserRoleEnum.CUSTOMER].includes(
          this.authUser.role
        ),
      },
      {
        route: '/sale-payment',
        name: 'Sale Payment',
        icon: './assets/images/icons/payment-menu.svg',
        visible: [UserRoleEnum.OWNER].includes(this.authUser.role),
      },
    ];
  }
}
