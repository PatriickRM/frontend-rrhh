import { Injectable } from '@angular/core';

export interface StoredUser {
  usuario: string;
  rol: string;
}


@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY  = 'user';

  get(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  set(token: string, user?: StoredUser): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  clear(): void {
    // FIX: remover AMBAS claves, no solo el token
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getUser(): StoredUser | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  isTokenExpired(): boolean {
    const token = this.get();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}