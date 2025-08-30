import { inject, Injectable } from '@angular/core';
import { EmployeesService } from './employee.service';
import { EmployeesRepository } from '../domain/repository/employee.repository';
import { Employee, EmployeeRequest, EmployeeUpdate, EmployeeStatus } from '../domain/model/employee';
import { Observable } from 'rxjs';
import { EMPLOYEES_REPOSITORY } from '../../../shared/tokens/di-tokens';

@Injectable({
  providedIn: 'root',
})
export class EmployeesServiceImpl implements EmployeesService {
  private repository = inject<EmployeesRepository>(EMPLOYEES_REPOSITORY);

  list(): Observable<Employee[]> {
    return this.repository.getAll();
  }

  get(id: number): Observable<Employee> {
    return this.repository.getById(id);
  }

  add(employee: EmployeeRequest): Observable<Employee> {
    return this.repository.create(employee);
  }

  edit(id: number, employee: EmployeeUpdate): Observable<Employee> {
    return this.repository.update(id, employee);
  }

  retire(id: number): Observable<Employee> {
    return this.repository.retire(id);
  }

  searchByName(name?: string): Observable<Employee[]> {
    return this.repository.searchByName(name);
  }

  getByDepartment(departmentId: number): Observable<Employee[]> {
    return this.repository.getByDepartment(departmentId);
  }

  getByPosition(positionId: number): Observable<Employee[]> {
    return this.repository.getByPosition(positionId);
  }

  getByHireDateRange(start: string, end: string): Observable<Employee[]> {
    return this.repository.getByHireDateRange(start, end);
  }

  filterByStatus(status: EmployeeStatus): Observable<Employee[]> {
    return this.repository.filterByStatus(status);
  }
}