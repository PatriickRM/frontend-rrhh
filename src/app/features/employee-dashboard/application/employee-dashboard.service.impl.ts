import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeDashboardService } from './employee-dashboard.service';
import { EmployeeDashboardRepository } from '../domain/repository/employee-dashboard.repository';
import { EmployeeDashboardDTO, EmployeeStatsDTO } from '../domain/model/employee-dashboard';
import { EMPLOYEE_DASHBOARD_REPOSITORY } from '../../../shared/tokens/di-tokens';

@Injectable({
  providedIn: 'root',
})
export class EmployeeDashboardServiceImpl implements EmployeeDashboardService {
  private repository = inject<EmployeeDashboardRepository>(EMPLOYEE_DASHBOARD_REPOSITORY);

  getDashboard(): Observable<EmployeeDashboardDTO> {
    return this.repository.getDashboard();
  }

  getStats(): Observable<EmployeeStatsDTO> {
    return this.repository.getStats();
  }
}