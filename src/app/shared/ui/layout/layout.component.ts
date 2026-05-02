import { Component, Inject, ViewChild } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AUTH_SERVICE } from '../../../shared/tokens/di-tokens';
import { AuthService } from '../../../features/auth/application/auth.service';

// Mapa de rutas → títulos de página
const PAGE_TITLES: Record<string, string> = {
  '/dashboard':                  'Dashboard',
  '/employees':                  'Empleados',
  '/departments':                'Departamentos',
  '/positions':                  'Puestos',
  '/users':                      'Usuarios',
  '/leaveC':                     'Solicitudes — RRHH',
  '/leaveH':                     'Solicitudes — Equipo',
  '/leaveE':                     'Mis Permisos',
  '/employee/dashboard':         'Mi Perfil',
  '/reports/positions-disabled': 'Reporte: Posiciones',
  '/reports/employees-by-date':  'Reporte: Empleados',
};

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  @ViewChild('sidebar') sidebarRef!: SidebarComponent;

  isDark = false;
  pageTitle = 'Dashboard';

  constructor(
    @Inject(AUTH_SERVICE) private auth: AuthService,
    private router: Router
  ) {
    // Actualizar título con cada navegación
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.pageTitle = PAGE_TITLES[e.urlAfterRedirects] ?? 'RRHH Sistema';
      });
  }

  get userName(): string {
    return this.auth.getUser()?.usuario ?? 'Usuario';
  }

  get userInitials(): string {
    return this.userName
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('light-mode', !this.isDark);
  }
}