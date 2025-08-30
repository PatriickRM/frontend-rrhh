import { Observable } from 'rxjs';
import { LeaveRequestHRDTO, LeaveHRResponseDTO } from '../model/leave-request.model';

export interface HRLeaveRequestRepository {
  getPendingRequests(): Observable<LeaveRequestHRDTO[]>;
  getAllRequests(): Observable<LeaveRequestHRDTO[]>;
  getRequestDetail(id: number): Observable<LeaveRequestHRDTO>;
  respondToRequest(response: LeaveHRResponseDTO): Observable<string>;
}