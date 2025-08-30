import { Observable } from 'rxjs';
import { EmployeeDashboardDTO, EmployeeStatsDTO } from '../model/employee-dashboard';

export interface EmployeeDashboardRepository {
  getDashboard(): Observable<EmployeeDashboardDTO>;
  getStats(): Observable<EmployeeStatsDTO>;
}