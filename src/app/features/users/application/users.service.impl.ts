import { inject, Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { UsersRepository } from '../domain/repository/users.repository';
import { User } from '../domain/model/users';
import { Observable } from 'rxjs';
import { USERS_REPOSITORY } from '../../../shared/tokens/di-tokens';

@Injectable({
  providedIn: 'root',
})
export class UsersServiceImpl implements UsersService {
  private repository = inject<UsersRepository>(USERS_REPOSITORY);

  list(): Observable<User[]> {
    return this.repository.getAll();
  }

  get(id: number): Observable<User> {
    return this.repository.getById(id);
  }

  add(user: Partial<User> & { password: string; roleId: number }): Observable<User> {
    return this.repository.create(user);
  }

  changeStatus(id: number, enabled: boolean): Observable<User> {
    return this.repository.updateStatus(id, enabled);
  }

  remove(id: number): Observable<User> {
    return this.repository.disable(id);
  }
}
