import { Observable } from 'rxjs';
import { LeaveRequestHeadDTO, LeaveHeadResponseDTO } from '../model/leave-request.model';

export interface HeadLeaveRequestRepository {
  getPendingRequests(): Observable<LeaveRequestHeadDTO[]>;
  getAllRequests(): Observable<LeaveRequestHeadDTO[]>;
  getRequestDetail(id: number): Observable<LeaveRequestHeadDTO>;
  respondToRequest(response: LeaveHeadResponseDTO): Observable<string>;
}
