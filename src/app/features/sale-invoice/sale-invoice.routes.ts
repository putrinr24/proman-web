import { Routes } from '@angular/router';
import { SaleInvoiceListComponent } from './pages/sale-invoice-list/sale-invoice-list.component';
import { SaleInvoiceAddComponent } from './pages/sale-invoice-add/sale-invoice-add.component';
import { SaleInvoiceViewComponent } from './pages/sale-invoice-view/sale-invoice-view.component';
import { SaleInvoiceComponent } from './sale-invoice.component';
import { RoleGuard } from '@core/guard/role.guard';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';

export const saleInvoiceRoutes: Routes = [
  {
    path: '',
    component: SaleInvoiceComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: SaleInvoiceListComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [UserRoleEnum.OWNER, UserRoleEnum.CUSTOMER],
        },
      },
      {
        path: 'add',
        component: SaleInvoiceAddComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [UserRoleEnum.OWNER],
        },
      },
      {
        path: 'view/:id',
        component: SaleInvoiceViewComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [UserRoleEnum.OWNER, UserRoleEnum.CUSTOMER],
        },
      },
    ],
  },
];
