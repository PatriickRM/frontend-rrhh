import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDashboardService } from '../application/employee-dashboard.service';
import {
  EmployeeDashboardDTO, EmployeeStatsDTO,
  LeaveBalanceDTO
} from '../domain/model/employee-dashboard';
import { Employee } from '../../employees/domain/model/employee';
import { EMPLOYEE_DASHBOARD_SERVICE } from '../../../shared/tokens/di-tokens';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-dashboard.page.html',
  styleUrl: './employee-dashboard.page.css'
})
export class EmployeeDashboardPage implements OnInit {
  private dashboardService = inject<EmployeeDashboardService>(EMPLOYEE_DASHBOARD_SERVICE);

  dashboardData: EmployeeDashboardDTO | null = null;
  employee: Employee | null = null;
  leaveBalance: LeaveBalanceDTO | null = null;
  stats: EmployeeStatsDTO | null = null;

  loading = true;
  error: string | null = null;

  ngOnInit(): void { this.loadDashboard(); }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.employee     = data.employee;
        this.leaveBalance = data.leaveBalance;
        this.stats        = data.stats;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el dashboard.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // FIX: usar los campos correctos del backend
  getVacationProgressPercentage(): number {
    if (!this.leaveBalance || this.leaveBalance.maxVacationDays === 0) return 0;
    return Math.min(
      (this.leaveBalance.usedVacationDays / this.leaveBalance.maxVacationDays) * 100,
      100
    );
  }

  getApprovalRate(): number {
    if (!this.stats || this.stats.totalRequests === 0) return 0;
    return (this.stats.approvedRequests / this.stats.totalRequests) * 100;
  }

  getEmployeeInitials(fullName: string): string {
    return (fullName ?? '').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      CONTRATADO: 'status-active',
      FINALIZADO: 'status-finalized',
      RETIRADO: 'status-retired'
    };
    return map[status] ?? 'status-default';
  }
}