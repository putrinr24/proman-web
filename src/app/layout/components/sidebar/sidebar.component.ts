import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { LayoutService } from '../../services/layout.service';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [FontAwesomeModule, CommonModule, RouterModule, SharedModule],
})
export class SidebarComponent implements OnInit {
  private readonly destroy$ = new Subject<void>();

  faChevronUp = faChevronUp;

  menuWithSequence: any[] = [];
  menuWithoutSequence: any[] = [];
  mainMenus: any = [];
  showUserMenu: boolean = false;

  // get user info
  user: any;

  @Input() showSidebar: boolean = true;
  @Input() hideWhenChangeRoute: boolean = true;
  @Output() onToggleSidebar: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private layoutService: LayoutService,
    public router: Router
  ) {
    this.mainMenus = this.layoutService.getRoutes();
    this.mainMenus.forEach((menu: any) => {
      if (menu.sequence) {
        this.menuWithSequence.push(menu);
      } else {
        this.menuWithoutSequence.push(menu);
      }
    });

    this.menuWithSequence.sort((a, b) => a.sequence - b.sequence);

    this.authService.getCurrentUserData.subscribe((data: any) => {
      this.user = data;
    });
  }

  ngOnInit(): void {
    this.checkActiveDropdownMenu();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.onToggleSidebar.emit(!this.showSidebar);
  }

  checkActiveDropdownMenu() {
    const CUR_URL = this.router.url.split('/');
    this.mainMenus.map((mainMenu: any) => {
      if (mainMenu.parentRoute) {
        mainMenu.subMenus.forEach((subMenu: any) => {
          let route = subMenu.route.split('/')[1];
          if (CUR_URL.includes(route)) {
            mainMenu.showRoutes = true;
          }
        });
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  get hasVisibleMenuWithSequence(): boolean {
    return this.menuWithSequence.some((menu) => menu.visible);
  }

  isActive(route: string): boolean {
    if (route === '/project' && this.router.url.startsWith('/feedback')) {
      return true;
    }
    return this.router.url.startsWith(route);
  }
}
