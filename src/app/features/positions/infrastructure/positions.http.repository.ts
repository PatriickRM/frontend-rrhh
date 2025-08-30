import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Position } from '../domain/model/positions';
import { PositionsRepository } from '../domain/respository/positions.repository';
import { POSITIONS_ENDPOINT } from '../../../shared/constants/api';

@Injectable()
export class PositionsHttpRepository implements PositionsRepository {
  private readonly BASE_URL = POSITIONS_ENDPOINT;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Position[]> {
    return this.http.get<Position[]>(this.BASE_URL).pipe(
      tap({
        next: res => console.log('GET /positions success:', res),
        error: err => console.error('GET /positions error:', err)
      })
    );
  }

  getById(id: number): Observable<Position> {
    return this.http.get<Position>(`${this.BASE_URL}/${id}`);
  }

  create(position: Partial<Position>): Observable<Position> {
    return this.http.post<Position>(this.BASE_URL, position);
  }

  update(id: number, position: Partial<Position>): Observable<Position> {
    return this.http.put<Position>(`${this.BASE_URL}/${id}`, position);
  }

  updateStatus(id: number, enabled: boolean): Observable<Position> {
    return this.http.patch<Position>(`${this.BASE_URL}/${id}/status`, { enabled });
  }
  getByDepartment(departmentId: number): Observable<Position[]> {
    return this.http.get<Position[]>(`${this.BASE_URL}/dep/${departmentId}`);
  }
}
