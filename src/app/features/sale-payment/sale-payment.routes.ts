import { Routes } from '@angular/router';
import { SalePaymentListComponent } from './pages/sale-payment-list/sale-payment-list.component';
import { SalePaymentViewComponent } from './pages/sale-payment-view/sale-payment-view.component';
import { SalePaymentComponent } from './sale-payment.component';
import { RoleGuard } from '@core/guard/role.guard';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';

export const salePaymentRoutes: Routes = [
  {
    path: '',
    component: SalePaymentComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: SalePaymentListComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [UserRoleEnum.OWNER, UserRoleEnum.CUSTOMER],
        },
      },
      {
        path: 'view/:id',
        component: SalePaymentViewComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [UserRoleEnum.OWNER, UserRoleEnum.CUSTOMER],
        },
      },
    ],
  },
];
