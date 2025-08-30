import { Component, inject, signal, computed } from '@angular/core';
import { DashboardService } from '../application/dashboard.service';
import { DashboardCard } from '../application/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  imports: [CommonModule],
  styleUrls: ['./dashboard.page.css'],
})
export class DashboardPage {
  private dashboardService = inject(DashboardService);

  // Estado reactivo
  cards = signal<DashboardCard[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Computed para verificar si hay tarjetas
  hasCards = computed(() => this.cards().length > 0);

  constructor() {
    this.loadDashboardCards();
  }

  private async loadDashboardCards() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await this.dashboardService.getDashboardCards();
      this.cards.set(result);
    } catch (err: any) {
      console.error('Error cargando el dashboard:', err);
      this.error.set('No se pudo cargar el dashboard. Intenta más tarde.');
    } finally {
      this.loading.set(false);
    }
  }

  // trackBy function para optimizar renderizado
  trackByTitle(index: number, card: DashboardCard) {
    return card.title;
  }
}
