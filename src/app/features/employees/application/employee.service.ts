import { Observable } from 'rxjs';
import { Employee, EmployeeRequest, EmployeeUpdate, EmployeeStatus } from '../domain/model/employee';

export interface EmployeesService {
  list(): Observable<Employee[]>;
  get(id: number): Observable<Employee>;
  add(employee: EmployeeRequest): Observable<Employee>;
  edit(id: number, employee: EmployeeUpdate): Observable<Employee>;
  retire(id: number): Observable<Employee>;
  searchByName(name?: string): Observable<Employee[]>;
  getByDepartment(departmentId: number): Observable<Employee[]>;
  getByPosition(positionId: number): Observable<Employee[]>;
  getByHireDateRange(start: string, end: string): Observable<Employee[]>;
  filterByStatus(status: EmployeeStatus): Observable<Employee[]>;
}