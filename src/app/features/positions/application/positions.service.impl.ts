import { inject, Injectable } from '@angular/core';
import { PositionsService } from './positions.service';
import { PositionsRepository } from '../domain/respository/positions.repository';
import { Position } from '../domain/model/positions';
import { Observable } from 'rxjs';
import { POSITIONS_REPOSITORY } from '../../../shared/tokens/di-tokens';

@Injectable({
  providedIn: 'root',
})
export class PositionsServiceImpl implements PositionsService {
  private repository = inject<PositionsRepository>(POSITIONS_REPOSITORY);

  list(): Observable<Position[]> {
    return this.repository.getAll();
  }

  get(id: number): Observable<Position> {
    return this.repository.getById(id);
  }

  add(position: Partial<Position>): Observable<Position> {
    return this.repository.create(position);
  }

  edit(id: number, position: Partial<Position>): Observable<Position> {
    return this.repository.update(id, position);
  }

  changeStatus(id: number, enabled: boolean): Observable<Position> {
    return this.repository.updateStatus(id, enabled);
  }

  remove(id: number): Observable<Position> {
    return this.repository.updateStatus(id, false);
  }
  getByDepartment(departmentId: number): Observable<Position[]> {
    return this.repository.getByDepartment(departmentId);
  }
}
