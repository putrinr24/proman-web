import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { userRoutes } from '@features/user/user.routes';
import { projectRoutes } from '@features/project/project.routes';
import { templateRoutes } from '@features/template/template.routes';
import { feedbackRoutes } from '@features/feedback/feedback.routes';
import { saleInvoiceRoutes } from '@features/sale-invoice/sale-invoice.routes';
import { salePaymentRoutes } from '@features/sale-payment/sale-payment.routes';

export const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../features/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'user',
        loadComponent: () =>
          import('../features/user/user.component').then(
            (c) => c.UserComponent
          ),
        children: userRoutes,
      },
      {
        path: 'project',
        loadComponent: () =>
          import('../features/project/project.component').then(
            (c) => c.ProjectsComponent
          ),
        children: projectRoutes,
      },
      {
        path: 'template',
        loadComponent: () =>
          import('../features/template/template.component').then(
            (c) => c.TemplateComponent
          ),
        children: templateRoutes,
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('../features/feedback/feedback.component').then(
            (c) => c.FeedbackComponent
          ),
        children: feedbackRoutes,
      },
      {
        path: 'sale-invoice',
        loadComponent: () =>
          import('../features/sale-invoice/sale-invoice.component').then(
            (c) => c.SaleInvoiceComponent
          ),
        children: saleInvoiceRoutes,
      },
      {
        path: 'sale-payment',
        loadComponent: () =>
          import('../features/sale-payment/sale-payment.component').then(
            (c) => c.SalePaymentComponent
          ),
        children: salePaymentRoutes,
      },
    ],
  },
];
