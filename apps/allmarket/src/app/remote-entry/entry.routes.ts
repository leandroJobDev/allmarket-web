import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('../components/login/login').then(m => m.Login) 
      },
      { 
        path: 'home', 
        loadComponent: () => import('../components/home/home').then(m => m.Home) 
      },
      { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
      }
    ]
  }
];