import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/ui/layout/layout.component';
import { LoginPage } from './features/auth/web/login.page';
import { DashboardPage } from './features/dashboard/web/dashboard.page';
import { DepartmentsPage } from './features/departments/web/departments.page';
import { PositionsPage } from './features/positions/web/positions.page';
import { EmployeesPage } from './features/employees/web/employees.page';
import { UsersPage } from './features/users/web/users.page';
import { LeaveRequestsPage } from './features/leave-requests/web/leave-requests-employee.page';
import { HeadLeaveRequestsPage } from './features/leave-requests/web/leave-requests-head.page';
import { HRLeaveRequestsPage } from './features/leave-requests/web/leave-request-chro.page';
import { DisabledPositionsComponent } from './features/reports/web/disabled-positions/disabled-positions.component';
import { EmployeeReportComponent } from './features/reports/web/employees/employee-report.component';
import { EmployeeDashboardPage } from './features/employee-dashboard/web/employee-dashboard.page';
import { NotFoundPage } from './shared/ui/not-found/not-found.page';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // ── CHRO ──────────────────────────────────────────────────
      {
        path: 'dashboard',
        component: DashboardPage,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_CHRO'] }
      },
      {
        path: 'employees',
        component: EmployeesPage,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_CHRO'] }
      },
      {
        path: 'departments',
        component: DepartmentsPage,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_CHRO'] }
      },
      {
        path: 'positions',
        component: PositionsPage,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_CHRO'] }
      },
      {
        path: 'users',
        component: UsersPage,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_CHRO'] }
      },
      {
        path: 'leaveC',
        component: HRLeaveRequestsPage,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_CHRO'] }
      },
      {
        path: 'reports/positions-disabled',
        component: DisabledPositionsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_CHRO'] }
      },
      {
        path: 'reports/employees-by-date',
        component: EmployeeReportComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_CHRO'] }
      },

      // ── HEAD ──────────────────────────────────────────────────
      {
        path: 'leaveH',
        component: HeadLeaveRequestsPage,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_HEAD'] }
      },

      // ── EMPLOYEE + HEAD ───────────────────────────────────────
      {
        path: 'leaveE',
        component: LeaveRequestsPage,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_EMPLOYEE', 'ROLE_HEAD'] }
      },
      {
        path: 'employee/dashboard',
        component: EmployeeDashboardPage,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_EMPLOYEE', 'ROLE_HEAD'] }
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Página 404 amigable
  { path: '404', component: NotFoundPage },
  { path: '**', redirectTo: '/404' }
];