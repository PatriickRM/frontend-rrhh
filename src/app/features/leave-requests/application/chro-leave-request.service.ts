import { Observable } from 'rxjs';
import { LeaveRequestHRDTO, LeaveHRResponseDTO } from '../domain/model/leave-request.model';

export interface HRLeaveRequestService {
  getPendingRequests(): Observable<LeaveRequestHRDTO[]>;
  getAllRequests(): Observable<LeaveRequestHRDTO[]>;
  getRequestDetail(id: number): Observable<LeaveRequestHRDTO>;
  respondToRequest(response: LeaveHRResponseDTO): Observable<string>;
}