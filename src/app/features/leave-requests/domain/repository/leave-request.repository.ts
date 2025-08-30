import { Observable } from 'rxjs';
import { LeaveBalance, LeaveRequest, LeaveRequestCreate } from '../model/leave-request.model';

export interface LeaveRequestRepository {
  getMyRequests(): Observable<LeaveRequest[]>;
  getById(id: number): Observable<LeaveRequest>;
  create(request: LeaveRequestCreate): Observable<LeaveRequest>;
  getMyBalance(): Observable<LeaveBalance>;
}