import { Injectable, inject } from '@angular/core';
import { EmployeesRepository } from '../../employees/domain/repository/employee.repository';
import { LeaveRequestRepository } from '../../leave-requests/domain/repository/leave-request.repository';
import { HeadLeaveRequestRepository } from '../../leave-requests/domain/repository/head-leave-request.repository';
import { HRLeaveRequestRepository } from '../../leave-requests/domain/repository/chro-leave-request.repository';
import { DepartmentsRepository } from '../../departments/domain/repository/departments.repository';
import { 
  EMPLOYEES_REPOSITORY, 
  LEAVE_REQUEST_REPOSITORY, 
  HEAD_LEAVE_REQUEST_REPOSITORY, 
  HR_LEAVE_REQUEST_REPOSITORY,
  DEPARTMENTS_REPOSITORY
} from '../../../shared/tokens/di-tokens';
import { TokenStorage } from '../../../core/storage/token.storage';
import { DashboardService, DashboardCard } from './dashboard.service';
import { firstValueFrom } from 'rxjs';
import { LeaveStatus } from '../../leave-requests/domain/model/leave-request.model';

@Injectable({ providedIn: 'root' })
export class DashboardServiceImpl extends DashboardService {
  private employeesRepo = inject(EMPLOYEES_REPOSITORY) as EmployeesRepository;
  private leaveRepo = inject(LEAVE_REQUEST_REPOSITORY) as LeaveRequestRepository;
  private headLeaveRepo = inject(HEAD_LEAVE_REQUEST_REPOSITORY) as HeadLeaveRequestRepository;
  private hrLeaveRepo = inject(HR_LEAVE_REQUEST_REPOSITORY) as HRLeaveRequestRepository;
  private departmentsRepo = inject(DEPARTMENTS_REPOSITORY) as DepartmentsRepository;
  private tokenStorage = inject(TokenStorage);

  async getDashboardCards(): Promise<DashboardCard[]> {
    const user = this.tokenStorage.getUser();
    if (!user) return [];

    switch (user.rol) {
      case 'ROLE_CHRO':
        return this.getCHROCards();
      case 'ROLE_HEAD':
        return this.getHeadCards();
      case 'ROLE_EMPLOYEE':
        return this.getEmployeeCards();
      default:
        return [];
    }
  }

  private async getCHROCards(): Promise<DashboardCard[]> {
    const [employees, leaveRequests, departments] = await Promise.all([
      firstValueFrom(this.employeesRepo.getAll()),
      firstValueFrom(this.hrLeaveRepo.getAllRequests()),
      firstValueFrom(this.departmentsRepo.getAll())
    ]);

    const approved = leaveRequests.filter(r => r.status === LeaveStatus.APROBADO).length;

    return [
      { title: 'Total de Solicitudes', value: leaveRequests.length, icon: 'insert_chart' },
      { title: 'Solicitudes Aprobadas', value: approved, icon: 'check_circle' },
      { title: 'Empleados', value: employees.length, icon: 'groups' },
      { title: 'Departamentos', value: departments.length, icon: 'apartment' }
    ];
  }

  private async getHeadCards(): Promise<DashboardCard[]> {
    const [employees, leaveRequests] = await Promise.all([
      firstValueFrom(this.employeesRepo.getAll()),
      firstValueFrom(this.headLeaveRepo.getAllRequests())
    ]);

    const approved = leaveRequests.filter(r => r.status === LeaveStatus.APROBADO).length;
    const rejected = leaveRequests.filter(r => r.status === LeaveStatus.RECHAZADO).length;

    return [
      { title: 'Solicitudes Validadas', value: approved, icon: 'check_circle' },
      { title: 'Solicitudes Rechazadas', value: rejected, icon: 'cancel' },
      { title: 'Reportes', value: leaveRequests.length, icon: 'bar_chart' }
    ];
  }

  private async getEmployeeCards(): Promise<DashboardCard[]> {
    const balance = await firstValueFrom(this.leaveRepo.getMyBalance());
    const employee = await firstValueFrom(this.employeesRepo.getById(balance.employeeId));

    return [
      { title: 'Días Totales', value: balance.maxVacationDays, icon: 'calendar_today' },
      { title: 'Días Usados', value: balance.usedVacationDays, icon: 'event_busy' },
      { title: 'Días Disponibles', value: balance.availableVacationDays, icon: 'event_available' },
      { title: 'Fecha de Contrato', value: employee.hireDate, icon: 'date_range' }
    ];
  }
}
