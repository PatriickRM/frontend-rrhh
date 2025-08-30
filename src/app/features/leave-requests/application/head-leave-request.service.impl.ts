import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaveRequestHeadDTO, LeaveHeadResponseDTO } from '../domain/model/leave-request.model';
import { HeadLeaveRequestService } from './head-leave-request.service';
import { HeadLeaveRequestRepository } from '../domain/repository/head-leave-request.repository';
import { HEAD_LEAVE_REQUEST_REPOSITORY } from '../../../shared/tokens/di-tokens';

@Injectable()
export class HeadLeaveRequestServiceImpl implements HeadLeaveRequestService {
  private repository = inject<HeadLeaveRequestRepository>(HEAD_LEAVE_REQUEST_REPOSITORY);

  getPendingRequests(): Observable<LeaveRequestHeadDTO[]> {
    return this.repository.getPendingRequests();
  }

  getAllRequests(): Observable<LeaveRequestHeadDTO[]> {
    return this.repository.getAllRequests();
  }

  getRequestDetail(id: number): Observable<LeaveRequestHeadDTO> {
    return this.repository.getRequestDetail(id);
  }

  respondToRequest(response: LeaveHeadResponseDTO): Observable<string> {
    return this.repository.respondToRequest(response);
  }
}