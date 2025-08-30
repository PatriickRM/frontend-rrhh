import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Employee, EmployeeRequest, EmployeeUpdate, EmployeeStatus } from '../domain/model/employee';
import { EmployeesRepository } from '../domain/repository/employee.repository';
import { EMPLOYEES_ENDPOINT } from '../../../shared/constants/api';

@Injectable()
export class EmployeesHttpRepository implements EmployeesRepository {
  private readonly BASE_URL = EMPLOYEES_ENDPOINT;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.BASE_URL).pipe(
      tap({
        next: res => console.log('GET /employees success:', res),
        error: err => console.error('GET /employees error:', err)
      })
    );
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.BASE_URL}/${id}`);
  }

  create(employee: EmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(this.BASE_URL, employee);
  }

  update(id: number, employee: EmployeeUpdate): Observable<Employee> {
    return this.http.put<Employee>(`${this.BASE_URL}/${id}`, employee);
  }

  retire(id: number): Observable<Employee> {
    return this.http.put<Employee>(`${this.BASE_URL}/${id}/retire`, {});
  }

  searchByName(name?: string): Observable<Employee[]> {
    let params = new HttpParams();
    if (name) {
      params = params.set('name', name);
    }
    return this.http.get<Employee[]>(`${this.BASE_URL}/search`, { params });
  }

  getByDepartment(departmentId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.BASE_URL}/department/${departmentId}`);
  }

  getByPosition(positionId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.BASE_URL}/position/${positionId}`);
  }

  getByHireDateRange(start: string, end: string): Observable<Employee[]> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get<Employee[]>(`${this.BASE_URL}/hire-date`, { params });
  }

  filterByStatus(status: EmployeeStatus): Observable<Employee[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Employee[]>(`${this.BASE_URL}/status`, { params });
  }
}