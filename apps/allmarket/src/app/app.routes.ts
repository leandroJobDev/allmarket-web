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
    loadChildren: () => {
      console.log('🚀 Carregando analise_mfe...');
      return loadRemoteModule('analise_mfe', './Routes')
        .then((m) => {
          console.log('✅ analise_mfe carregado:', m);
          return m.remoteRoutes;
        })
        .catch((err) => {
          console.error('❌ Erro ao carregar analise_mfe:', err);
          throw err;
        });
    },
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

