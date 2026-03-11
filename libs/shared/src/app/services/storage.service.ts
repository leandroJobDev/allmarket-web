import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private memoryStorage: Map<string, string> = new Map();
  private isLocalStorageAvailable = false;

  constructor() {
    this.checkLocalStorage();
  }

  private checkLocalStorage(): void {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      this.isLocalStorageAvailable = true;
    } catch (e) {
      console.warn('localStorage não disponível, usando memória');
      this.isLocalStorageAvailable = false;
    }
  }

  getItem(key: string): string | null {
    if (this.isLocalStorageAvailable) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error('Erro ao ler localStorage:', e);
      }
    }
    return this.memoryStorage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable) {
      try {
        localStorage.setItem(key, value);
        return;
      } catch (e) {
        console.error('Erro ao escrever localStorage:', e);
      }
    }
    this.memoryStorage.set(key, value);
  }

  removeItem(key: string): void {
    if (this.isLocalStorageAvailable) {
      try {
        localStorage.removeItem(key);
        return;
      } catch (e) {
        console.error('Erro ao remover localStorage:', e);
      }
    }
    this.memoryStorage.delete(key);
  }

  clear(): void {
    if (this.isLocalStorageAvailable) {
      try {
        localStorage.clear();
      } catch (e) {
        console.error('Erro ao limpar localStorage:', e);
      }
    }
    this.memoryStorage.clear();
  }
}
