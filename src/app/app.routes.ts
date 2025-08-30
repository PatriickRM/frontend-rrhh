import { Routes } from '@angular/router';
import { LayoutComponent } from "./shared/ui/layout/layout.component";
import { LoginPage } from "./features/auth/web/login.page";
import { DashboardPage } from "./features/dashboard/web/dashboard.page";
import { DepartmentsPage } from './features/departments/web/departments.page';
import { PositionsPage } from "./features/positions/web/positions.page";
import { EmployeesPage } from "./features/employees/web/employees.page";
import { RolesPage } from "./features/roles/web/roles.page";
import { UsersPage } from "./features/users/web/users.page";
import { LeaveRequestsPage } from './features/leave-requests/web/leave-requests-employee.page'; 
import { HeadLeaveRequestsPage } from './features/leave-requests/web/leave-requests-head.page';
import { HRLeaveRequestsPage } from './features/leave-requests/web/leave-request-chro.page';
import { DisabledPositionsComponent } from './features/reports/web/disabled-positions/disabled-positions.component';
import { EmployeeReportComponent } from './features/reports/web/employees/employee-report.component';
import { EmployeeDashboardPage } from './features/employee-dashboard/web/employee-dashboard.page';

import { AuthGuard } from "./core/guards/auth.guard";

export const routes: Routes = [

  { path: 'login', component: LoginPage },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], 
    children: [
      { path: 'dashboard', component: DashboardPage },
      { path: 'departments', component: DepartmentsPage },
      { path: 'positions', component: PositionsPage },
      { path: 'employees', component: EmployeesPage },
      { path: 'roles', component: RolesPage },
      { path: 'users', component: UsersPage },
      { path: 'leaveE', component: LeaveRequestsPage },
      { path: 'leaveH', component: HeadLeaveRequestsPage },
      { path: 'leaveC', component: HRLeaveRequestsPage },
      { path: 'reports/positions-disabled', component: DisabledPositionsComponent },
      { path: 'reports/employees-by-date', component: EmployeeReportComponent },
      { path : 'employee/dashboard', component: EmployeeDashboardPage },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
