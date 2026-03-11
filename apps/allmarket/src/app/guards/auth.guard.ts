import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const userData = localStorage.getItem('allmarket_user');

  if (userData) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const notAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const userData = localStorage.getItem('allmarket_user');

  if (!userData) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
