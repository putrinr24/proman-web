import { Routes } from '@angular/router';
import { TemplateComponent } from './template.component';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';
import { RoleGuard } from '@core/guard/role.guard';
import { TemplateListComponent } from './pages/template-list/template-list.component';
import { TemplateViewComponent } from './pages/template-view/template-view.component';
import { TemplateAddComponent } from './pages/template-add/template-add.component';

export const templateRoutes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: TemplateListComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [UserRoleEnum.OWNER, UserRoleEnum.PROJECT_MANAGER],
        },
      },
      {
        path: 'add',
        component: TemplateAddComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [
            UserRoleEnum.OWNER,
            UserRoleEnum.PROJECT_MANAGER,
            UserRoleEnum.DEVELOPER,
          ],
        },
      },
      {
        path: 'view/:id',
        component: TemplateViewComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [UserRoleEnum.OWNER, UserRoleEnum.PROJECT_MANAGER],
        },
      },
    ],
  },
];
