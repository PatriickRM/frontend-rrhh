import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { EmployeeDashboardRepository } from '../domain/repository/employee-dashboard.repository';
import { EmployeeDashboardDTO, EmployeeStatsDTO } from '../domain/model/employee-dashboard';
import { EMPLOYEE_DASHBOARD_ENDPOINT } from '../../../shared/constants/api';

@Injectable()
export class EmployeeDashboardHttpRepository implements EmployeeDashboardRepository {
  private readonly BASE_URL = EMPLOYEE_DASHBOARD_ENDPOINT;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<EmployeeDashboardDTO> {
    return this.http.get<EmployeeDashboardDTO>(`${this.BASE_URL}/dashboard`).pipe(
      tap({
        next: res => console.log('GET /employee/dashboard success:', res),
        error: err => console.error('GET /employee/dashboard error:', err)
      })
    );
  }

  getStats(): Observable<EmployeeStatsDTO> {
    return this.http.get<EmployeeStatsDTO>(`${this.BASE_URL}/stats`).pipe(
      tap({
        next: res => console.log('GET /employee/stats success:', res),
        error: err => console.error('GET /employee/stats error:', err)
      })
    );
  }
}