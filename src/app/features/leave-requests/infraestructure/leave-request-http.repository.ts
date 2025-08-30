import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LeaveRequest, LeaveRequestCreate, LeaveBalance } from '../domain/model/leave-request.model';
import { LeaveRequestRepository } from '../domain/repository/leave-request.repository';
import { environment } from '../../../../environment/environments.development';

@Injectable()
export class LeaveRequestHttpRepository implements LeaveRequestRepository {
  private readonly BASE_URL = `${environment.apiBaseUrl}/api/employee/leave-requests`;

  constructor(private http: HttpClient) {}

  getMyRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(this.BASE_URL).pipe(
      tap({
        next: res => console.log('GET leave-requests success:', res),
        error: err => console.error('GET leave-requests error:', err)
      })
    );
  }

  getById(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${this.BASE_URL}/${id}`);
  }

  create(request: LeaveRequestCreate): Observable<LeaveRequest> {
    const formData = new FormData();
    
    // Crear el objeto request sin el archivo
    const requestData = {
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      justification: request.justification
    };
    
    formData.append('request', new Blob([JSON.stringify(requestData)], {
      type: 'application/json'
    }));
    
    if (request.evidenceFile) {
      formData.append('evidence', request.evidenceFile);
    }

    return this.http.post<LeaveRequest>(this.BASE_URL, formData);
  }

  getMyBalance(): Observable<LeaveBalance> {
    return this.http.get<LeaveBalance>(`${this.BASE_URL}/balance`);
  }
}
