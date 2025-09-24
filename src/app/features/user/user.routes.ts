import { Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserComponent } from './user.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { UserViewComponent } from './pages/user-view/user-view.component';
import { RoleGuard } from '@core/guard/role.guard';
import { UserRoleEnum } from './enums/user-role-enum';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: UserListComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [UserRoleEnum.OWNER, UserRoleEnum.PROJECT_MANAGER],
        },
      },
      {
        path: 'add',
        component: UserAddComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [UserRoleEnum.OWNER, UserRoleEnum.PROJECT_MANAGER],
        },
      },
      {
        path: 'view/:id',
        component: UserViewComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [UserRoleEnum.OWNER, UserRoleEnum.PROJECT_MANAGER],
        },
      },
    ],
  },
];
