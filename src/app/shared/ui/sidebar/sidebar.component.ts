import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AUTH_SERVICE } from '../../../shared/tokens/di-tokens';
import { AuthService } from '../../../features/auth/application/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  isMobileOpen = false;
  pendingCount = 0; // Conectar al servicio real si se desea

  constructor(
    @Inject(AUTH_SERVICE) public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Restaurar estado del sidebar del localStorage
    const saved = localStorage.getItem('sidebar-collapsed');
    this.isCollapsed = saved === 'true';
  }

  get userRole(): string {
    return this.auth.getUser()?.rol ?? '';
  }

  get userName(): string {
    return this.auth.getUser()?.usuario ?? 'Usuario';
  }

  get userInitials(): string {
    const name = this.userName;
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  get roleLabel(): string {
    const map: Record<string, string> = {
      ROLE_CHRO:     'Director RRHH',
      ROLE_HEAD:     'Jefe de Dpto.',
      ROLE_EMPLOYEE: 'Empleado',
    };
    return map[this.userRole] ?? this.userRole;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebar-collapsed', String(this.isCollapsed));
  }

  openMobile() {
    this.isMobileOpen = true;
  }

  closeMobile() {
    this.isMobileOpen = false;
  }

  handleLogout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // Cerrar sidebar móvil al presionar Escape
  @HostListener('document:keydown.escape')
  onEscape() {
    this.isMobileOpen = false;
  }
}