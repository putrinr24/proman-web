import { RouterModule, Routes } from '@angular/router';
import { layoutRoutes } from './layout/layout.routes';
import { authRoutes } from '@features/auth/auth.routes';

// export const routes: Routes = [...layoutRoutes];

export const routes: Routes = [
  {
    path: '',
    children: layoutRoutes,
    data: { animation: 'layout' },
  },
  {
    path: 'auth',
    loadComponent: async () => {
      const m = await import('./features/auth/auth.component');
      return m.AuthComponent;
    },
    children: authRoutes,
    data: { animation: 'auth' },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

export default RouterModule.forRoot(routes, {
  initialNavigation: 'enabledBlocking',
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
  paramsInheritanceStrategy: 'always',
});
