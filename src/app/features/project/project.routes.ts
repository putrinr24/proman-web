import { Routes } from '@angular/router';
import { ProjectsComponent } from './project.component';
import { RoleGuard } from '@core/guard/role.guard';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { ProjectAddComponent } from './pages/project-add/project-add.component';
import { ProjectViewComponent } from './pages/project-view/project-view.component';

export const projectRoutes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ProjectListComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [
            UserRoleEnum.OWNER,
            UserRoleEnum.PROJECT_MANAGER,
            UserRoleEnum.DEVELOPER,
            UserRoleEnum.CUSTOMER,
          ],
        },
      },
      {
        path: 'add',
        component: ProjectAddComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [UserRoleEnum.OWNER, UserRoleEnum.PROJECT_MANAGER],
        },
      },
      {
        path: 'view/:id',
        component: ProjectViewComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [
            UserRoleEnum.OWNER,
            UserRoleEnum.PROJECT_MANAGER,
            UserRoleEnum.DEVELOPER,
            UserRoleEnum.CUSTOMER,
          ],
        },
      },
    ],
  },
];
