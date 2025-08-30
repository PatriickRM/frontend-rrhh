import { Observable } from 'rxjs';
import { LeaveRequest, LeaveRequestCreate, LeaveBalance } from '../domain/model/leave-request.model';

export interface LeaveRequestService {
  list(): Observable<LeaveRequest[]>;
  get(id: number): Observable<LeaveRequest>;
  create(request: LeaveRequestCreate): Observable<LeaveRequest>;
  getBalance(): Observable<LeaveBalance>;
}
