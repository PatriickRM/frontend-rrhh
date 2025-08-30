import { Observable } from 'rxjs';
import { User } from '../model/users';

export interface UsersRepository {
  getAll(): Observable<User[]>;
  getById(id: number): Observable<User>;
  create(user: Partial<User> & { password: string; roleId: number }): Observable<User>;
  updateStatus(id: number, enabled: boolean): Observable<User>;
  disable(id: number): Observable<User>;
}
