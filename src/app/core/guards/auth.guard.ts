import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorage } from '../storage/token.storage';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private tokenStorage: TokenStorage, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.tokenStorage.getUser(); 
    if (!user) {
      // No autenticado
      this.router.navigate(['/login']);
      return false;
    }

    // Redirección condicional según rol
    if (state.url === '/' || state.url === '/dashboard') {
      if (user.rol === 'ROLE_EMPLOYEE' || user.rol === 'ROLE_HEAD') {
        this.router.navigate(['/employee/dashboard']);
        return false;
      }
    }

    return true;
  }
}

