import { Observable } from 'rxjs';
import { Position } from '../domain/model/positions';

export interface PositionsService {
  list(): Observable<Position[]>;
  get(id: number): Observable<Position>;
  add(position: Partial<Position>): Observable<Position>;
  edit(id: number, position: Partial<Position>): Observable<Position>;
  changeStatus(id: number, enabled: boolean): Observable<Position>;
  remove(id: number): Observable<Position>;
  getByDepartment(departmentId: number): Observable<Position[]>;
}
