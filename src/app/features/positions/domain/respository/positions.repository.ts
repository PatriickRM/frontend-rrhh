import { Observable } from 'rxjs';
import { Position } from '../model/positions';

export interface PositionsRepository {
  getAll(): Observable<Position[]>;
  getById(id: number): Observable<Position>;
  create(position: Partial<Position>): Observable<Position>;
  update(id: number, position: Partial<Position>): Observable<Position>;
  updateStatus(id: number, enabled: boolean): Observable<Position>;
  getByDepartment(departmentId: number): Observable<Position[]>;
}
