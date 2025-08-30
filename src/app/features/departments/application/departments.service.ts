import { Observable } from 'rxjs';
import { Department } from '../domain/model/departments';

export interface DepartmentsService {
  list(): Observable<Department[]>;
  get(id: number): Observable<Department>;
  add(department: Partial<Department>): Observable<Department>;
  edit(id: number, department: Partial<Department>): Observable<Department>;
  changeStatus(id: number, enabled: boolean): Observable<Department>;
  remove(id: number): Observable<Department>; 
}
