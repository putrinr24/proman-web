import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  faBars,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faPowerOff,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { HeaderConfig } from '../../interfaces/header-config.interface';
import { LayoutService } from '../../services/layout.service';
import { Title } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '@shared/shared.module';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, CommonModule, RouterModule, SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  faBars = faBars;
  faUser = faUser;
  faChevronDown = faChevronDown;
  faPowerOff = faPowerOff;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  @Input() showSidebar = true;
  @Output() onToggleSidebar = new EventEmitter<boolean>();

  headerConfit: HeaderConfig | null = null;
  searchConfig: any = {};
  menus: any = [];
  user: any = {};
  showMenus = false;

  constructor(
    private layoutService: LayoutService,
    private authService: AuthService,
    private title: Title,
    private location: Location
  ) {
    this.authService.getCurrentUserData.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
    this.menus = this.layoutService.getRoutes();
    this.layoutService.headerConfigSubject.subscribe((config: any) => {
      this.headerConfit = config;
      this.title.setTitle(config.title);
    });
    this.authService.getCurrentUserData
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.user = user;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.onToggleSidebar.emit(!this.showSidebar);
  }

  goToPrevPage() {
    this.location.back();
  }

  goToForwardPage() {
    this.location.forward();
  }

  getUserInitials(user: any): string {
    if (!user) return '';

    let roleInitial = '';
    switch (user.role) {
      case UserRoleEnum.OWNER:
        roleInitial = 'O';
        break;
      case UserRoleEnum.PROJECT_MANAGER:
        roleInitial = 'M';
        break;
      case UserRoleEnum.DEVELOPER:
        roleInitial = 'D';
        break;
      case UserRoleEnum.CUSTOMER:
        roleInitial = 'C';
        break;
      default:
        roleInitial = '?';
    }

    const nameInitial = user.name ? user.name.charAt(0).toUpperCase() : '';

    return roleInitial + nameInitial;
  }

  logout(): void {
    this.authService.logout();
  }
}
