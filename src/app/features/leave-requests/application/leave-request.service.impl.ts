import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaveRequestService } from './leave-request.service';
import { LeaveRequestRepository } from '../domain/repository/leave-request.repository';
import { LeaveRequest, LeaveRequestCreate, LeaveBalance } from '../domain/model/leave-request.model';
import { LEAVE_REQUEST_REPOSITORY } from '../../../shared/tokens/di-tokens';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestServiceImpl implements LeaveRequestService {
  private repository = inject<LeaveRequestRepository>(LEAVE_REQUEST_REPOSITORY);

  list(): Observable<LeaveRequest[]> {
    return this.repository.getMyRequests();
  }

  get(id: number): Observable<LeaveRequest> {
    return this.repository.getById(id);
  }

  create(request: LeaveRequestCreate): Observable<LeaveRequest> {
    return this.repository.create(request);
  }

  getBalance(): Observable<LeaveBalance> {
    return this.repository.getMyBalance();
  }
}