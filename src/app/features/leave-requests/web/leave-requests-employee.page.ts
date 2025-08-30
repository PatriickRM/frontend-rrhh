import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveRequest, LeaveRequestCreate, LeaveBalance, LeaveType, LeaveStatus } from '../domain/model/leave-request.model';
import { LeaveRequestService } from '../application/leave-request.service';
import { LEAVE_REQUEST_SERVICE } from '../../../shared/tokens/di-tokens';

@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-requests-employee.page.html',
  styleUrl: './leave-requests-employee.page.css'
})
export class LeaveRequestsPage implements OnInit {
  private leaveRequestService = inject<LeaveRequestService>(LEAVE_REQUEST_SERVICE);

  requests: LeaveRequest[] = [];
  balance: LeaveBalance | null = null;
  loading = true;
  error: string | null = null;

  // Estados para modales
  showFormModal = false;
  showDetailsModal = false;

  selectedRequest: LeaveRequest | null = null;
  selectedFile: File | null = null;

  // Enums para el template
  LeaveType = LeaveType;
  LeaveStatus = LeaveStatus;

  ngOnInit(): void {
    this.fetchRequests();
    this.fetchBalance();
  }

  fetchRequests() {
    this.leaveRequestService.list().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las solicitudes.';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  fetchBalance() {
    this.leaveRequestService.getBalance().subscribe({
      next: (data) => {
        this.balance = data;
      },
      error: (err) => {
        console.error('Error al cargar balance:', err);
      }
    });
  }

  abrirFormulario() {
    this.showFormModal = true;
  }

  abrirDetalles(request: LeaveRequest) {
    this.selectedRequest = request;
    this.showDetailsModal = true;
  }

  cerrarModal() {
    this.showFormModal = false;
    this.showDetailsModal = false;
    this.selectedRequest = null;
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  handleCrear(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const request: LeaveRequestCreate = {
      type: formData.get('type') as LeaveType,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      justification: formData.get('justification') as string,
      evidenceFile: this.selectedFile || undefined
    };

    this.leaveRequestService.create(request).subscribe({
      next: () => {
        this.fetchRequests();
        this.fetchBalance(); // Actualizar balance después de crear
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error creando solicitud:', err);
        alert('Error al crear la solicitud: ' + (err.error?.message || 'Error desconocido'));
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

  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  getTypeIcon(type: LeaveType): string {
    switch (type) {
    case LeaveType.VACACIONES:
      return 'beach_access'; // Vacaciones
    case LeaveType.ENFERMEDAD:
      return 'healing'; 
    case LeaveType.CITA_MEDICA:
      return 'medical_information'; 
    case LeaveType.FALLECIMIENTO_FAMILIAR:
      return 'sentiment_very_dissatisfied'; 
    case LeaveType.MATRIMONIO:
      return 'favorite'; 
    case LeaveType.MUDANZA:
      return 'home'; 
    default:
      return 'event_note'; 
  }
  }
}
