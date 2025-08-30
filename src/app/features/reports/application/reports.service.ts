import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Position } from '../../positions/domain/model/positions';
import { ReportsRepository } from '../infrastructure/reports.repository';
import { Employee } from '../../employees/domain/model/employee';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private repository = inject(ReportsRepository);

  // Obtener posiciones deshabilitadas
  getDisabledPositions(): Observable<Position[]> {
    return this.repository.getDisabledPositions();
  }

  // Obtener departamentos
  getDepartments(): Observable<{ id: number; name: string }[]> {
    return this.repository.getDepartments();
  }

  // Obtener empleados por rango de fechas
  getEmployeesByHireDate(start: string, end: string): Observable<Employee[]> {
    return this.repository.getEmployeesByHireDate(start, end);
  }
}
