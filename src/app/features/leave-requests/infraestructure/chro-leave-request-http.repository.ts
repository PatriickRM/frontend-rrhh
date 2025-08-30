import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LeaveRequestHRDTO, LeaveHRResponseDTO } from '../domain/model/leave-request.model';
import { HRLeaveRequestRepository } from '../domain/repository/chro-leave-request.repository';
import { environment } from '../../../../environment/environments.development';

@Injectable()
export class HRLeaveRequestHttpRepository implements HRLeaveRequestRepository {
  private readonly BASE_URL = `${environment.apiBaseUrl}/api/chro/leave-requests`;

  constructor(private http: HttpClient) {}

  getPendingRequests(): Observable<LeaveRequestHRDTO[]> {
    return this.http.get<LeaveRequestHRDTO[]>(`${this.BASE_URL}/pending`).pipe(
      tap({
        next: res => console.log('GET HR pending requests success:', res),
        error: err => console.error('GET HR pending requests error:', err)
      })
    );
  }

  getAllRequests(): Observable<LeaveRequestHRDTO[]> {
    return this.http.get<LeaveRequestHRDTO[]>(`${this.BASE_URL}/all`).pipe(
      tap({
        next: res => console.log('GET HR all requests success:', res),
        error: err => console.error('GET HR all requests error:', err)
      })
    );
  }

  getRequestDetail(id: number): Observable<LeaveRequestHRDTO> {
    return this.http.get<LeaveRequestHRDTO>(`${this.BASE_URL}/${id}`).pipe(
      tap({
        next: res => console.log('GET HR request detail success:', res),
        error: err => console.error('GET HR request detail error:', err)
      })
    );
  }

  respondToRequest(response: LeaveHRResponseDTO): Observable<string> {
    return this.http.put<string>(`${this.BASE_URL}/respond`, response).pipe(
      tap({
        next: res => console.log('PUT HR response success:', res),
        error: err => console.error('PUT HR response error:', err)
      })
    );
  }
}
