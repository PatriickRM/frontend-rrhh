import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {
  private key = 'token';
  private userKey = 'user';

  get(): string | null {
    return localStorage.getItem(this.key);
  }

  set(token: string, user?: { usuario: string; rol: string }): void {
    localStorage.setItem(this.key, token);
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
  getUser(): { usuario: string; rol: string } | null {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : null;
  }
}