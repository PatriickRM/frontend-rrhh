import { Observable } from 'rxjs';
import { EmployeeDashboardDTO, EmployeeStatsDTO } from '../domain/model/employee-dashboard';

export interface EmployeeDashboardService {
  getDashboard(): Observable<EmployeeDashboardDTO>;
  getStats(): Observable<EmployeeStatsDTO>;
}