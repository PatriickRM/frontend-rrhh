import { Observable } from 'rxjs';
import { Employee, EmployeeRequest, EmployeeUpdate, EmployeeStatus } from '../model/employee';
import { PagedResponse, PageRequest } from '../../../../shared/models/paged-response.model';

export interface EmployeesRepository {
  getAll(): Observable<Employee[]>;
  getById(id: number): Observable<Employee>;
  create(employee: EmployeeRequest): Observable<Employee>;
  update(id: number, employee: EmployeeUpdate): Observable<Employee>;
  retire(id: number): Observable<Employee>;
  searchByName(name?: string, req?: PageRequest): Observable<PagedResponse<Employee>>;
  getByDepartment(departmentId: number): Observable<Employee[]>;
  getByPosition(positionId: number): Observable<Employee[]>;
  getByHireDateRange(start: string, end: string): Observable<Employee[]>;
  filterByStatus(status: EmployeeStatus): Observable<Employee[]>;
}