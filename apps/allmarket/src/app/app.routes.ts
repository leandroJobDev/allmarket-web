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
      loadRemoteModule('notas_mfe', './Routes').then((m) => m.remoteRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'analise',
    loadChildren: () =>
      loadRemoteModule('analise_mfe', './Routes').then((m) => m.remoteRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'comparador',
    loadChildren: () =>
      loadRemoteModule('comparador_mfe', './Routes').then((m) => m.remoteRoutes),
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

