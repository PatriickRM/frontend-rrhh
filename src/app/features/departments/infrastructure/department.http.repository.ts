import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Department } from '../domain/model/departments';
import { DepartmentsRepository } from '../domain/repository/departments.repository';
import { DEPARTMENTS_ENDPOINT } from '../../../shared/constants/api';

@Injectable()
export class DepartmentsHttpRepository implements DepartmentsRepository {
  private readonly BASE_URL = DEPARTMENTS_ENDPOINT;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.BASE_URL).pipe(
      tap({
        next: res => console.log('GET /departments success:', res),
        error: err => console.error('GET /departments error:', err)
      })
    );
  }

  getById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.BASE_URL}/${id}`);
  }

  create(department: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.BASE_URL, department);
  }

  update(id: number, department: Partial<Department>): Observable<Department> {
    return this.http.put<Department>(`${this.BASE_URL}/${id}`, department);
  }

  updateStatus(id: number, enabled: boolean): Observable<Department> {
    return this.http.patch<Department>(`${this.BASE_URL}/${id}/status`, { enabled });
  }
}
