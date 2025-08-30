import { inject, Injectable } from '@angular/core';
import { DepartmentsService } from './departments.service';
import { DepartmentsRepository } from '../domain/repository/departments.repository';
import { Department } from '../domain/model/departments';
import { Observable } from 'rxjs';
import { DEPARTMENTS_REPOSITORY } from '../../../shared/tokens/di-tokens';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsServiceImpl implements DepartmentsService {
  private repository = inject<DepartmentsRepository>(DEPARTMENTS_REPOSITORY);

  list(): Observable<Department[]> {
    return this.repository.getAll();
  }

  get(id: number): Observable<Department> {
    return this.repository.getById(id);
  }

  add(department: Partial<Department>): Observable<Department> {
    return this.repository.create(department);
  }

  edit(id: number, department: Partial<Department>): Observable<Department> {
    return this.repository.update(id, department);
  }

  changeStatus(id: number, enabled: boolean): Observable<Department> {
    return this.repository.updateStatus(id, enabled);
  }

  remove(id: number): Observable<Department> {
    return this.repository.updateStatus(id, false);
  }
}
