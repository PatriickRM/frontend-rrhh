import { Observable } from 'rxjs';
import { Department } from '../model/departments';

export interface DepartmentsRepository {
  getAll(): Observable<Department[]>;
  getById(id: number): Observable<Department>;
  create(department: Partial<Department>): Observable<Department>;
  update(id: number, department: Partial<Department>): Observable<Department>;
  updateStatus(id: number, enabled: boolean): Observable<Department>;
}
