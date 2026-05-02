import { Component, inject, signal, computed, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardCard } from '../application/dashboard.service';
import { AUTH_SERVICE, HR_LEAVE_REQUEST_SERVICE } from '../../../shared/tokens/di-tokens';
import { AuthService } from '../../auth/application/auth.service';
import { HRLeaveRequestService } from '../../leave-requests/application/chro-leave-request.service';
import { LeaveRequestHRDTO, LeaveStatus, LeaveType } from '../../leave-requests/domain/model/leave-request.model';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
  imports: [CommonModule, RouterLink],
})
export class DashboardPage implements OnInit {
  private dashboardService = inject(DashboardService);
  @Inject(AUTH_SERVICE) private authService!: AuthService;

  cards    = signal<DashboardCard[]>([]);
  loading  = signal(true);
  error    = signal<string | null>(null);

  hasCards = computed(() => this.cards().length > 0);

  // Extra data for CHRO sections
  recentRequests: LeaveRequestHRDTO[] = [];
  approvedPct     = 0;
  pendingPct      = 0;
  rejectedPct     = 0;
  activeEmployeesPct = 92; // Valor ilustrativo — conectar al servicio real

  get isCHRO(): boolean {
    return (inject(AUTH_SERVICE) as AuthService).getUser()?.rol === 'ROLE_CHRO';
  }

  get userName(): string {
    return inject(AUTH_SERVICE) as any;
  }

  get today(): string {
    return new Date().toLocaleDateString('es-PE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  ngOnInit() {
    this.load();
  }

  private async load() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await this.dashboardService.getDashboardCards();
      this.cards.set(result);
    } catch {
      this.error.set('No se pudo cargar el dashboard. Intenta de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }

  retry() { this.load(); }

  trackByTitle(_: number, card: DashboardCard) { return card.title; }

  // ── Helpers de estilo ─────────────────────────────────────

  getIconColor(icon: string): string {
    const map: Record<string, string> = {
      insert_chart:    'purple',
      check_circle:    'green',
      groups:          'teal',
      apartment:       'amber',
      calendar_today:  'purple',
      event_busy:      'amber',
      event_available: 'green',
      date_range:      'teal',
      bar_chart:       'teal',
      cancel:          'amber',
    };
    return map[icon] ?? 'purple';
  }

  getTrendClass(card: DashboardCard): string {
    const v = Number(card.value);
    if (isNaN(v)) return 'neutral';
    return v > 0 ? 'up' : 'neutral';
  }

  getTrendIcon(card: DashboardCard): string {
    return this.getTrendClass(card) === 'up' ? 'trending_up' : 'remove';
  }

  getTrendLabel(card: DashboardCard): string {
    return this.getTrendClass(card) === 'up' ? 'Activo' : '—';
  }

  getCardSub(card: DashboardCard): string {
    const subs: Record<string, string> = {
      'Total de Solicitudes': 'acumulado del año',
      'Solicitudes Aprobadas': 'aprobadas este año',
      'Empleados':            'en nómina activa',
      'Departamentos':        'unidades activas',
      'Días Totales':         'días por contrato',
      'Días Usados':          'días consumidos',
      'Días Disponibles':     'días restantes',
    };
    return subs[card.title] ?? '';
  }

  getBarWidth(card: DashboardCard): string {
    const total = this.cards().reduce((acc, c) => acc + Number(c.value || 0), 0);
    if (!total) return '0%';
    const pct = Math.min((Number(card.value) / total) * 100 * 4, 100);
    return pct + '%';
  }

  // ── Recent requests helpers ───────────────────────────────

  getInitials(name: string): string {
    return (name ?? '').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  getTypeLabel(type: LeaveType): string {
    const labels: Record<string, string> = {
      VACACIONES:            'Vacaciones',
      ENFERMEDAD:            'Enfermedad',
      CITA_MEDICA:           'Cita médica',
      FALLECIMIENTO_FAMILIAR:'Fallecimiento',
      MATRIMONIO:            'Matrimonio',
      MUDANZA:               'Mudanza',
    };
    return labels[type] ?? type;
  }

  getStatusLabel(status: LeaveStatus): string {
    const labels: Record<string, string> = {
      PENDIENTE_JEFE: 'Pend. Jefe',
      PENDIENTE_RRHH: 'Pend. RRHH',
      APROBADO:       'Aprobado',
      RECHAZADO:      'Rechazado',
    };
    return labels[status] ?? status;
  }

  getStatusBadge(status: LeaveStatus): string {
    const map: Record<string, string> = {
      APROBADO:       'badge badge-success',
      RECHAZADO:      'badge badge-danger',
      PENDIENTE_JEFE: 'badge badge-warning',
      PENDIENTE_RRHH: 'badge badge-info',
    };
    return map[status] ?? 'badge';
  }

  formatDate(date: any): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  }
}