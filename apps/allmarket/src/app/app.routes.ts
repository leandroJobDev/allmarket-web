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
      // Aqui passamos exatamente os 2 argumentos que o erro TS2554 pediu
      loadRemoteModule('notas_mfe', './Routes').then((m) => m.remoteRoutes),
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

