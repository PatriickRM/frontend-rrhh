import { Employee } from '../../../employees/domain/model/employee';

export interface LeaveBalanceDTO {
  employeeId: number;
  employeeName: string;
  yearsOfService: number;
  maxVacationDays: number;       // era totalVacationDays
  usedVacationDays: number;
  availableVacationDays: number; // era remainingVacationDays
}

export interface MonthlyStatsDTO {
  month: string;
  count: number;
}

export interface TypeStatsDTO {
  type: string;
  count: number;
  percentage: number;
}

export interface EmployeeStatsDTO {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
  rejectedRequests: number;
  requestsByMonth: MonthlyStatsDTO[];
  requestsByType: TypeStatsDTO[];
  averageResponseDays: number;
}

export interface EmployeeDashboardDTO {
  employee: Employee;
  leaveBalance: LeaveBalanceDTO;
  stats: EmployeeStatsDTO;
}