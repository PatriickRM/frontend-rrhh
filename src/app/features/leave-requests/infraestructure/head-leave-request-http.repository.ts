import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LeaveRequestHeadDTO, LeaveHeadResponseDTO } from '../domain/model/leave-request.model';
import { HeadLeaveRequestRepository } from '../domain/repository/head-leave-request.repository';
import { environment } from '../../../../environment/environments.development';

@Injectable()
export class HeadLeaveRequestHttpRepository implements HeadLeaveRequestRepository {
  private readonly BASE_URL = `${environment.apiBaseUrl}/api/head/leave-requests`;

  constructor(private http: HttpClient) {}

  getPendingRequests(): Observable<LeaveRequestHeadDTO[]> {
    return this.http.get<LeaveRequestHeadDTO[]>(`${this.BASE_URL}/pending`).pipe(
      tap({
        next: res => console.log('GET head pending requests success:', res),
        error: err => console.error('GET head pending requests error:', err)
      })
    );
  }

  getAllRequests(): Observable<LeaveRequestHeadDTO[]> {
    return this.http.get<LeaveRequestHeadDTO[]>(`${this.BASE_URL}/all`).pipe(
      tap({
        next: res => console.log('GET head all requests success:', res),
        error: err => console.error('GET head all requests error:', err)
      })
    );
  }

  getRequestDetail(id: number): Observable<LeaveRequestHeadDTO> {
    return this.http.get<LeaveRequestHeadDTO>(`${this.BASE_URL}/${id}`).pipe(
      tap({
        next: res => console.log('GET head request detail success:', res),
        error: err => console.error('GET head request detail error:', err)
      })
    );
  }

  respondToRequest(response: LeaveHeadResponseDTO): Observable<string> {
    return this.http.put<string>(`${this.BASE_URL}/respond`, response).pipe(
      tap({
        next: res => console.log('PUT head response success:', res),
        error: err => console.error('PUT head response error:', err)
      })
    );
  }
}   