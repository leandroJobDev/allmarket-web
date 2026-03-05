import { Route } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { loadRemoteModule } from '@nx/angular/mf';
import { authGuard, notAuthGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: Login,
    canActivate: [notAuthGuard]
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard]
  },
  {
    path: 'notas',
    loadChildren: () =>
      // Aqui passamos exatamente os 2 argumentos que o erro TS2554 pediu
      loadRemoteModule('notas_mfe', './Routes').then((m) => m.remoteRoutes),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

