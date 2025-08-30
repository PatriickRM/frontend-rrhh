import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient,withInterceptors } from '@angular/common/http';

import { authInterceptor } from './core/http/auth.interceptor';
// Tokens
import { 
  AUTH_REPOSITORY, AUTH_SERVICE, 
  DEPARTMENTS_REPOSITORY, DEPARTMENTS_SERVICE, 
  POSITIONS_REPOSITORY, POSITIONS_SERVICE,
  USERS_REPOSITORY, USERS_SERVICE,EMPLOYEES_REPOSITORY, EMPLOYEES_SERVICE,
   LEAVE_REQUEST_REPOSITORY, LEAVE_REQUEST_SERVICE,HEAD_LEAVE_REQUEST_REPOSITORY, HEAD_LEAVE_REQUEST_SERVICE,
    HR_LEAVE_REQUEST_REPOSITORY, HR_LEAVE_REQUEST_SERVICE,
    EMPLOYEE_DASHBOARD_REPOSITORY,
    EMPLOYEE_DASHBOARD_SERVICE
} from './shared/tokens/di-tokens';

// Auth
import { AuthHttpRepository } from './features/auth/infrastructure/auth.http.repository';
import { AuthServiceImpl } from './features/auth/application/auth.service.impl';

// Departments
import { DepartmentsHttpRepository } from './features/departments/infrastructure/department.http.repository';
import { DepartmentsServiceImpl } from './features/departments/application/departments.service.impl';

// Positions
import { PositionsHttpRepository } from './features/positions/infrastructure/positions.http.repository';
import { PositionsServiceImpl } from './features/positions/application/positions.service.impl';

// Users
import { UsersHttpRepository } from './features/users/infrastructure/users.http.repository';
import { UsersServiceImpl } from './features/users/application/users.service.impl';

// Employees
import { EmployeesHttpRepository } from './features/employees/infraestructure/employee-http.repository';
import { EmployeesServiceImpl } from './features/employees/application/employee.service.impl'; 

// Leave Requests
import { LeaveRequestHttpRepository } from './features/leave-requests/infraestructure/leave-request-http.repository';
import { LeaveRequestServiceImpl } from './features/leave-requests/application/leave-request.service.impl';
import { HeadLeaveRequestHttpRepository } from './features/leave-requests/infraestructure/head-leave-request-http.repository';
import { HeadLeaveRequestServiceImpl } from './features/leave-requests/application/head-leave-request.service.impl';
import { HRLeaveRequestServiceImpl } from './features/leave-requests/application/chro-leave-request.service.impl';
import { HRLeaveRequestHttpRepository } from './features/leave-requests/infraestructure/chro-leave-request-http.repository';

// Dashboard
import { DashboardService } from './features/dashboard/application/dashboard.service';
import { DashboardServiceImpl } from './features/dashboard/application/dashboard.service.impl';

// Employee Dashboard
import { EmployeeDashboardServiceImpl } from './features/employee-dashboard/application/employee-dashboard.service.impl';
import { EmployeeDashboardHttpRepository } from './features/employee-dashboard/infrastructure/employee-dashboard-http.repository';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
  withInterceptors([authInterceptor])
),

    // Auth
    { provide: AUTH_REPOSITORY, useClass: AuthHttpRepository },
    { provide: AUTH_SERVICE, useClass: AuthServiceImpl },

    // Departments
    { provide: DEPARTMENTS_REPOSITORY, useClass: DepartmentsHttpRepository },
    { provide: DEPARTMENTS_SERVICE, useClass: DepartmentsServiceImpl },

    // Positions
    { provide: POSITIONS_REPOSITORY, useClass: PositionsHttpRepository },
    { provide: POSITIONS_SERVICE, useClass: PositionsServiceImpl },

    // Users
    { provide: USERS_REPOSITORY, useClass: UsersHttpRepository },
    { provide: USERS_SERVICE, useClass: UsersServiceImpl },

    // Employees
    { provide: EMPLOYEES_REPOSITORY, useClass: EmployeesHttpRepository },
    { provide: EMPLOYEES_SERVICE, useClass: EmployeesServiceImpl },

    // Leave Requests
    { provide: LEAVE_REQUEST_REPOSITORY, useClass: LeaveRequestHttpRepository },
    { provide: LEAVE_REQUEST_SERVICE, useClass: LeaveRequestServiceImpl },

    // Head Leave Requests
    { provide: HEAD_LEAVE_REQUEST_REPOSITORY, useClass: HeadLeaveRequestHttpRepository },
    { provide: HEAD_LEAVE_REQUEST_SERVICE, useClass: HeadLeaveRequestServiceImpl },
    // HR Leave Requests
    { provide: HR_LEAVE_REQUEST_REPOSITORY, useClass: HRLeaveRequestHttpRepository },
    { provide: HR_LEAVE_REQUEST_SERVICE, useClass: HRLeaveRequestServiceImpl },
    // Dashboard
    { provide: DashboardService, useClass: DashboardServiceImpl },
    
    // Employee Dashboard
    { provide: EMPLOYEE_DASHBOARD_REPOSITORY, useClass: EmployeeDashboardHttpRepository },
    { provide: EMPLOYEE_DASHBOARD_SERVICE, useClass: EmployeeDashboardServiceImpl }
  ],
};
