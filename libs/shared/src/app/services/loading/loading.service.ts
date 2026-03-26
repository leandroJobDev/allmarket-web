import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = signal<boolean>(false);
  loading$ = this.loading.asReadonly();

  show() {
    this.loading.set(true);
  }

  hide() {
    this.loading.set(false);
  }
}
