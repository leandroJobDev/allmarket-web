import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const userData = localStorage.getItem('allmarket_user');
  console.log('[AuthGuard] Checking auth for route:', state.url, 'userData:', !!userData);

  if (userData) {
    console.log('[AuthGuard] Authenticated, allowing access');
    return true;
  }

  console.log('[AuthGuard] Not authenticated, redirecting to login');
  router.navigate(['/login']);
  return false;
};

export const notAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const userData = localStorage.getItem('allmarket_user');
  console.log('[NotAuthGuard] Checking auth for route:', state.url, 'userData:', !!userData);

  if (!userData) {
    console.log('[NotAuthGuard] Not authenticated, allowing access to:', state.url);
    return true;
  }

  console.log('[NotAuthGuard] Already authenticated, redirecting to home');
  router.navigate(['/']);
  return false;
};
