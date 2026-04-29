import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';
import { TokenStorage } from '../storage/token.storage';
import { ToastService } from '../services/toast.service';


@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private tokenStorage: TokenStorage,
    private router: Router,
    private toast: ToastService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.tokenStorage.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles: string[] = route.data?.['roles'] ?? [];

    // Si no se especifican roles, cualquier usuario autenticado puede acceder
    if (allowedRoles.length === 0) return true;

    if (allowedRoles.includes(user.rol)) return true;

    // Usuario autenticado pero sin el rol requerido
    this.toast.warning('No tienes permisos para acceder a esta sección.');
    this.router.navigate([this.getDefaultRoute(user.rol)]);
    return false;
  }

  private getDefaultRoute(rol: string): string {
    if (rol === 'ROLE_CHRO')    return '/dashboard';
    if (rol === 'ROLE_HEAD')    return '/employee/dashboard';
    if (rol === 'ROLE_EMPLOYEE') return '/employee/dashboard';
    return '/login';
  }
}