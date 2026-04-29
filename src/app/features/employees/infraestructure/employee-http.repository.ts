import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Employee, EmployeeRequest, EmployeeUpdate, EmployeeStatus
} from '../domain/model/employee';
import { EmployeesRepository } from '../domain/repository/employee.repository';
import { EMPLOYEES_ENDPOINT } from '../../../shared/constants/api';
import { PagedResponse, PageRequest } from '../../../shared/models/paged-response.model';

/**
 * FIX:
 * 1. Eliminados todos los console.log (el interceptor maneja errores).
 * 2. Los métodos de lista ahora devuelven PagedResponse<Employee>
 *    para soportar la paginación del backend (P3).
 * 3. getAll() extrae el array .content para compatibilidad con código existente.
 */
@Injectable()
export class EmployeesHttpRepository implements EmployeesRepository {
  private readonly BASE_URL = EMPLOYEES_ENDPOINT;

  constructor(private http: HttpClient) {}

  // Devuelve solo el array — compatibilidad con dashboard y servicios internos
  getAll(): Observable<Employee[]> {
    return this.http
      .get<PagedResponse<Employee>>(`${this.BASE_URL}?page=0&size=1000`)
      .pipe(map(res => res.content));
  }

  // Versión paginada para la tabla principal
  getAllPaged(req: PageRequest = {}): Observable<PagedResponse<Employee>> {
    const params = new HttpParams()
      .set('page',  String(req.page  ?? 0))
      .set('size',  String(req.size  ?? 20))
      .set('sort',  req.sort ?? 'fullName,asc');
    return this.http.get<PagedResponse<Employee>>(this.BASE_URL, { params });
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

  searchByName(name?: string, req: PageRequest = {}): Observable<PagedResponse<Employee>> {
    let params = new HttpParams()
      .set('page', String(req.page ?? 0))
      .set('size', String(req.size ?? 20));
    if (name?.trim()) params = params.set('name', name.trim());
    return this.http.get<PagedResponse<Employee>>(`${this.BASE_URL}/search`, { params });
  }

  getByDepartment(departmentId: number): Observable<Employee[]> {
    return this.http
      .get<PagedResponse<Employee>>(`${this.BASE_URL}/department/${departmentId}?page=0&size=500`)
      .pipe(map(res => res.content));
  }

  getByPosition(positionId: number): Observable<Employee[]> {
    return this.http
      .get<PagedResponse<Employee>>(`${this.BASE_URL}/position/${positionId}?page=0&size=500`)
      .pipe(map(res => res.content));
  }

  getByHireDateRange(start: string, end: string): Observable<Employee[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http
      .get<PagedResponse<Employee>>(`${this.BASE_URL}/hire-date`, { params })
      .pipe(map(res => res.content));
  }

  filterByStatus(status: EmployeeStatus): Observable<Employee[]> {
    const params = new HttpParams().set('status', status);
    return this.http
      .get<PagedResponse<Employee>>(`${this.BASE_URL}/status`, { params })
      .pipe(map(res => res.content));
  }
}