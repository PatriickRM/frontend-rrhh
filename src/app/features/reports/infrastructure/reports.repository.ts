import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Position } from '../../positions/domain/model/positions';
import { HttpClient, HttpParams } from '@angular/common/http';
import { POSITIONS_ENDPOINT, DEPARTMENTS_ENDPOINT, EMPLOYEES_ENDPOINT } from '../../../shared/constants/api';
import { Employee } from '../../employees/domain/model/employee';

@Injectable({
  providedIn: 'root'
})
export class ReportsRepository {
  private http = inject(HttpClient);
  private readonly POSITIONS_URL = POSITIONS_ENDPOINT;
  private readonly DEPARTMENTS_URL = DEPARTMENTS_ENDPOINT;
  private readonly EMPLOYEES_URL = EMPLOYEES_ENDPOINT;

  // Obtener posiciones deshabilitadas
  getDisabledPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(`${this.POSITIONS_URL}/disabled`);
  }

  // Obtener todos los departamentos
  getDepartments(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(this.DEPARTMENTS_URL);
  }

  // Obtener empleados por rango de fechas
  getEmployeesByHireDate(start: string, end: string): Observable<Employee[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<Employee[]>(`${this.EMPLOYEES_URL}/hire-date`, { params });
  }
}
