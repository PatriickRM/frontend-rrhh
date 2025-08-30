import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { 
  LeaveRequestHRDTO, 
  LeaveHRResponseDTO, 
  LeaveType, 
  LeaveStatus 
} from '../domain/model/leave-request.model';
import { environment } from '../../../../environment/environments.development';

@Component({
  selector: 'app-hr-leave-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-request-chro.page.html',
  styleUrl: './leave-requests-chro.page.css'
})
export class HRLeaveRequestsPage implements OnInit {
  private readonly BASE_URL = `${environment.apiBaseUrl}/api/chro/leave-requests`;

  requests: LeaveRequestHRDTO[] = [];
  filteredRequests: LeaveRequestHRDTO[] = [];
  loading = true;
  error: string | null = null;

  // Estados para modales
  showDetailsModal = false;
  showResponseModal = false;

  selectedRequest: LeaveRequestHRDTO | null = null;
  
  // Filtros
  currentFilter: 'pending' | 'all' = 'pending';
  selectedStatus: LeaveStatus | 'all' = 'all';
  selectedType: LeaveType | 'all' = 'all';
  selectedDepartment: string | 'all' = 'all';

  // Para respuesta de RRHH
  responseData: LeaveHRResponseDTO = {
    requestId: 0,
    status: LeaveStatus.APROBADO,
    comment: ''
  };

  // Lista de departamentos para filtro
  departments: string[] = [];

  // Enums para el template
  LeaveType = LeaveType;
  LeaveStatus = LeaveStatus;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  loadPendingRequests() {
    this.currentFilter = 'pending';
    this.loading = true;
    this.error = null;

    this.http.get<LeaveRequestHRDTO[]>(`${this.BASE_URL}/pending`).subscribe({
      next: (data) => {
        this.requests = data;
        this.extractDepartments();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las solicitudes pendientes.';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  loadAllRequests() {
    this.currentFilter = 'all';
    this.loading = true;
    this.error = null;

    this.http.get<LeaveRequestHRDTO[]>(`${this.BASE_URL}/all`).subscribe({
      next: (data) => {
        this.requests = data;
        this.extractDepartments();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar todas las solicitudes.';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  extractDepartments() {
    const uniqueDepartments = [...new Set(this.requests.map(req => req.employeeDepartment))];
    this.departments = uniqueDepartments.sort();
  }

  applyFilters() {
    this.filteredRequests = this.requests.filter(request => {
      const statusMatch = this.selectedStatus === 'all' || request.status === this.selectedStatus;
      const typeMatch = this.selectedType === 'all' || request.type === this.selectedType;
      const departmentMatch = this.selectedDepartment === 'all' || request.employeeDepartment === this.selectedDepartment;
      return statusMatch && typeMatch && departmentMatch;
    });
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onTypeFilterChange() {
    this.applyFilters();
  }

  onDepartmentFilterChange() {
    this.applyFilters();
  }

  abrirDetalles(request: LeaveRequestHRDTO) {
    this.http.get<LeaveRequestHRDTO>(`${this.BASE_URL}/${request.id}`).subscribe({
      next: (detailedRequest) => {
        this.selectedRequest = detailedRequest;
        this.showDetailsModal = true;
      },
      error: (err) => {
        console.error('Error al cargar detalles:', err);
        alert('Error al cargar los detalles de la solicitud');
      }
    });
  }

  abrirModalRespuesta(request: LeaveRequestHRDTO) {
    this.selectedRequest = request;
    this.responseData = {
      requestId: request.id,
      status: LeaveStatus.APROBADO,
      comment: ''
    };
    this.showResponseModal = true;
  }

  cerrarModales() {
    this.showDetailsModal = false;
    this.showResponseModal = false;
    this.selectedRequest = null;
    this.responseData = {
      requestId: 0,
      status: LeaveStatus.APROBADO,
      comment: ''
    };
  }

  enviarRespuesta() {
    if (!this.responseData.comment.trim()) {
      alert('Por favor, ingrese un comentario');
      return;
    }

    this.http.put(`${this.BASE_URL}/respond`, this.responseData, { responseType: 'text' }).subscribe({
      next: () => {
        this.cerrarModales();
        if (this.currentFilter === 'pending') {
          this.loadPendingRequests();
        } else {
          this.loadAllRequests();
        }
        alert('Respuesta enviada exitosamente');
      },
      error: (err) => {
        console.error('Error al enviar respuesta:', err);
        alert('Error al enviar la respuesta: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }

  getStatusClass(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.APROBADO:
        return 'status-approved';
      case LeaveStatus.PENDIENTE_JEFE:
        return 'status-pending-head';
      case LeaveStatus.PENDIENTE_RRHH:
        return 'status-pending-hr';
      case LeaveStatus.RECHAZADO:
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }

  getTypeDisplayName(type: LeaveType): string {
    switch (type) {
      case LeaveType.VACACIONES:
        return 'Vacaciones';
      case LeaveType.ENFERMEDAD:
        return 'Enfermedad';
      case LeaveType.CITA_MEDICA:
        return 'Cita Médica';
      case LeaveType.FALLECIMIENTO_FAMILIAR:
        return 'Fallecimiento Familiar';
      case LeaveType.MATRIMONIO:
        return 'Matrimonio';
      case LeaveType.MUDANZA:
        return 'Mudanza';
      default:
        return type;
    }
  }

  getStatusDisplayName(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.PENDIENTE_JEFE:
        return 'Pendiente Jefe';
      case LeaveStatus.PENDIENTE_RRHH:
        return 'Pendiente RRHH';
      case LeaveStatus.APROBADO:
        return 'Aprobado';
      case LeaveStatus.RECHAZADO:
        return 'Rechazado';
      default:
        return status;
    }
  }

  getTypeIcon(type: LeaveType): string {
    switch (type) {
      case LeaveType.VACACIONES:
        return 'beach_access';
      case LeaveType.ENFERMEDAD:
        return 'local_hospital';
      case LeaveType.CITA_MEDICA:
        return 'medical_services';
      case LeaveType.FALLECIMIENTO_FAMILIAR:
        return 'sentiment_very_dissatisfied';
      case LeaveType.MATRIMONIO:
        return 'favorite';
      case LeaveType.MUDANZA:
        return 'moving';
      default:
        return 'event_note';
    }
  }

  getUrgencyClass(request: LeaveRequestHRDTO): string {
    const today = new Date();
    const startDate = new Date(request.startDate);
    const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilStart <= 2) return 'urgent';
    if (daysUntilStart <= 7) return 'soon';
    return 'normal';
  }

  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  getEvidenceImageUrl(imagePath?: string): string {
    if (!imagePath) return '';
    return `${environment.apiBaseUrl}/api/files/evidence/${imagePath}`;
  }

  canRespond(request: LeaveRequestHRDTO): boolean {
    return request.status === LeaveStatus.PENDIENTE_RRHH;
  }

  getProcessingStage(request: LeaveRequestHRDTO): string {
    switch (request.status) {
      case LeaveStatus.PENDIENTE_JEFE:
        return 'En revisión de jefe de departamento';
      case LeaveStatus.PENDIENTE_RRHH:
        return 'Listo para revisión final de RRHH';
      case LeaveStatus.APROBADO:
        return 'Proceso completado - Aprobado';
      case LeaveStatus.RECHAZADO:
        return 'Proceso completado - Rechazado';
      default:
        return 'Estado desconocido';
    }
  }

  getWorkflowIcon(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.PENDIENTE_JEFE:
        return 'supervisor_account';
      case LeaveStatus.PENDIENTE_RRHH:
        return 'business_center';
      case LeaveStatus.APROBADO:
        return 'check_circle';
      case LeaveStatus.RECHAZADO:
        return 'cancel';
      default:
        return 'help';
    }
  }
}