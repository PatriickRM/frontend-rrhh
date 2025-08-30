import { Observable } from 'rxjs';
import { LeaveRequestHeadDTO, LeaveHeadResponseDTO } from '../domain/model/leave-request.model';

export interface HeadLeaveRequestService {
  getPendingRequests(): Observable<LeaveRequestHeadDTO[]>;
  getAllRequests(): Observable<LeaveRequestHeadDTO[]>;
  getRequestDetail(id: number): Observable<LeaveRequestHeadDTO>;
  respondToRequest(response: LeaveHeadResponseDTO): Observable<string>;
}