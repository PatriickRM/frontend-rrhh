
import { InjectionToken } from "@angular/core";


import { AuthRepository } from "../../features/auth/domain/repository/auth.repository";
import { AuthService } from "../../features/auth/application/auth.service";

import { DepartmentsRepository } from "../../features/departments/domain/repository/departments.repository";
import { DepartmentsService } from "../../features/departments/application/departments.service";


import { PositionsRepository } from "../../features/positions/domain/respository/positions.repository";
import { PositionsService } from '../../features/positions/application/positions.service';


import { UsersRepository } from './../../features/users/domain/repository/users.repository';
import { UsersService } from "../../features/users/application/users.service";

import { EmployeesRepository } from "../../features/employees/domain/repository/employee.repository";
import { EmployeesService } from "../../features/employees/application/employee.service";

import { LeaveRequestService } from "../../features/leave-requests/application/leave-request.service";
import { LeaveRequestRepository } from "../../features/leave-requests/domain/repository/leave-request.repository";

import { HeadLeaveRequestRepository } from '../../features/leave-requests/domain/repository/head-leave-request.repository';
import { HeadLeaveRequestService } from '../../features/leave-requests/application/head-leave-request.service';

import { HRLeaveRequestRepository } from "../../features/leave-requests/domain/repository/chro-leave-request.repository";
import { HRLeaveRequestService } from "../../features/leave-requests/application/chro-leave-request.service";

import { EmployeeDashboardService } from "../../features/employee-dashboard/application/employee-dashboard.service";
import { EmployeeDashboardRepository } from "../../features/employee-dashboard/domain/repository/employee-dashboard.repository";

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');
export const AUTH_SERVICE = new InjectionToken<AuthService>('AUTH_SERVICE');

export const DEPARTMENTS_REPOSITORY = new InjectionToken<DepartmentsRepository>('DEPARTMENTS_REPOSITORY');
export const DEPARTMENTS_SERVICE = new InjectionToken<DepartmentsService>('DEPARTMENTS_SERVICE');

export const POSITIONS_REPOSITORY = new InjectionToken<PositionsRepository>('POSITIONS_REPOSITORY');
export const POSITIONS_SERVICE = new InjectionToken<PositionsService>('POSITIONS_SERVICE');

export const USERS_REPOSITORY = new InjectionToken<UsersRepository>('USERS_REPOSITORY');
export const USERS_SERVICE = new InjectionToken<UsersService>('USERS_SERVICE');

export const EMPLOYEES_REPOSITORY = new InjectionToken<EmployeesRepository>('EMPLOYEES_REPOSITORY');
export const EMPLOYEES_SERVICE = new InjectionToken<EmployeesService>('EMPLOYEES_SERVICE');

export const LEAVE_REQUEST_SERVICE = new InjectionToken<LeaveRequestService>('LeaveRequestService');
export const LEAVE_REQUEST_REPOSITORY = new InjectionToken<LeaveRequestRepository>('LeaveRequestRepository');

export const HEAD_LEAVE_REQUEST_REPOSITORY = new InjectionToken<HeadLeaveRequestRepository>('HEAD_LEAVE_REQUEST_REPOSITORY');
export const HEAD_LEAVE_REQUEST_SERVICE = new InjectionToken<HeadLeaveRequestService>('HEAD_LEAVE_REQUEST_SERVICE');

export const HR_LEAVE_REQUEST_REPOSITORY = new InjectionToken<HRLeaveRequestRepository>('HR_LEAVE_REQUEST_REPOSITORY');
export const HR_LEAVE_REQUEST_SERVICE = new InjectionToken<HRLeaveRequestService>('HR_LEAVE_REQUEST_SERVICE');

export const EMPLOYEE_DASHBOARD_SERVICE = new InjectionToken<EmployeeDashboardService>('EmployeeDashboardService');
export const EMPLOYEE_DASHBOARD_REPOSITORY = new InjectionToken<EmployeeDashboardRepository>('EmployeeDashboardRepository');
