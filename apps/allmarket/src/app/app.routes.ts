import { Route } from '@angular/router';
import { Login } from './components/login/login';
import { loadRemoteModule } from '@nx/angular/mf';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'notas',
    loadChildren: () =>
      loadRemoteModule('notas-mfe', './Module').catch(() => {
        throw new Error('MFE_LOAD_ERROR');
      }),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

