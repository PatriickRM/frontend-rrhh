import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../domain/model/users';
import { UsersRepository } from '../domain/repository/users.repository';
import { USERS_ENDPOINT } from '../../../shared/constants/api';

@Injectable()
export class UsersHttpRepository implements UsersRepository {
  private readonly BASE_URL = USERS_ENDPOINT;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.BASE_URL).pipe(
      tap({
        next: res => console.log('GET /users success:', res),
        error: err => console.error('GET /users error:', err),
      })
    );
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.BASE_URL}/${id}`);
  }

  create(user: Partial<User> & { password: string; roleId: number }): Observable<User> {
    return this.http.post<User>(this.BASE_URL, user);
  }

  updateStatus(id: number, enabled: boolean): Observable<User> {
    return this.http.patch<User>(`${this.BASE_URL}/${id}/status`, { enabled });
  }

  disable(id: number): Observable<User> {
    return this.http.patch<User>(`${this.BASE_URL}/${id}/disable`, {});
  }
}
