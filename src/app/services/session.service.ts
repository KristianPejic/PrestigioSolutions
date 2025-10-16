import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private isStorageAvailable(): boolean {
    return typeof sessionStorage !== 'undefined';
  }

  setItem(key: string, value: string): void {
    if (this.isStorageAvailable()) {
      try {
        sessionStorage.setItem(key, value);
      } catch (error) {
        console.error('Failed to set session storage item:', error);
      }
    }
  }

  getItem(key: string): string | null {
    if (this.isStorageAvailable()) {
      try {
        return sessionStorage.getItem(key);
      } catch (error) {
        console.error('Failed to get session storage item:', error);
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isStorageAvailable()) {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error('Failed to remove session storage item:', error);
      }
    }
  }

  clear(): void {
    if (this.isStorageAvailable()) {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error('Failed to clear session storage:', error);
      }
    }
  }

  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }
}
