import { Routes } from '@angular/router';
import { AttachmentComponent } from './attachment.component';
import { RoleGuard } from '@core/guard/role.guard';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';
import { AttachmentListComponent } from './pages/attachment-list/attachment-list.component';

export const attachmentRoute: Routes = [
  {
    path: '',
    component: AttachmentComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: AttachmentListComponent,
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
