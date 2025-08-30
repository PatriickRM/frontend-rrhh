
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaveRequestHRDTO, LeaveHRResponseDTO } from '../domain/model/leave-request.model';
import { HRLeaveRequestService } from './chro-leave-request.service';
import { HRLeaveRequestRepository } from '../domain/repository/chro-leave-request.repository';
import { HR_LEAVE_REQUEST_REPOSITORY } from '../../../shared/tokens/di-tokens';

@Injectable()
export class HRLeaveRequestServiceImpl implements HRLeaveRequestService {
  private repository = inject<HRLeaveRequestRepository>(HR_LEAVE_REQUEST_REPOSITORY);

  getPendingRequests(): Observable<LeaveRequestHRDTO[]> {
    return this.repository.getPendingRequests();
  }

  getAllRequests(): Observable<LeaveRequestHRDTO[]> {
    return this.repository.getAllRequests();
  }

  getRequestDetail(id: number): Observable<LeaveRequestHRDTO> {
    return this.repository.getRequestDetail(id);
  }

  respondToRequest(response: LeaveHRResponseDTO): Observable<string> {
    return this.repository.respondToRequest(response);
  }
}