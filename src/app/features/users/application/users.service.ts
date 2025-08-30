import { Observable } from 'rxjs';
import { User } from '../domain/model/users';

export interface UsersService {
  list(): Observable<User[]>;
  get(id: number): Observable<User>;
  add(user: Partial<User> & { password: string; roleId: number }): Observable<User>;
  changeStatus(id: number, enabled: boolean): Observable<User>;
  remove(id: number): Observable<User>;
}
