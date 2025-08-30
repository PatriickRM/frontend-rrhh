export enum LeaveType {
  VACACIONES = 'VACACIONES',
  ENFERMEDAD = 'ENFERMEDAD',
  CITA_MEDICA = 'CITA_MEDICA',
  FALLECIMIENTO_FAMILIAR = 'FALLECIMIENTO_FAMILIAR',
  MATRIMONIO = 'MATRIMONIO',
  MUDANZA = 'MUDANZA'
}

export enum LeaveStatus {
  PENDIENTE_JEFE = 'PENDIENTE_JEFE',
  PENDIENTE_RRHH = 'PENDIENTE_RRHH',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO'
}

export interface LeaveRequest {
  id: number;
  type: LeaveType;
  startDate: string;
  endDate: string;
  justification: string;
  status: LeaveStatus;
  requestDate: string;
  headComment?: string;
  hrComment?: string;
  reviewedByHeadName?: string;
  headResponseDate?: string;
  hrResponseDate?: string;
}

export interface LeaveRequestCreate {
  type: LeaveType;
  startDate: string;
  endDate: string;
  justification: string;
  evidenceFile?: File;
}

export interface LeaveBalance {
  employeeId: number;
  employeeName: string;
  maxVacationDays: number;
  usedVacationDays: number;
  availableVacationDays: number;
  yearsOfService: number;
}

export interface LeaveRequestHeadDTO {
  id: number;
  employeeName: string;
  employeeDepartment: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  justification: string;
  requestDate: string;
  headResponseDate?: string;
  evidenceImagePath?: string;
}

export interface LeaveHeadResponseDTO {
  requestId: number;
  status: LeaveStatus;
  comment: string;
}

export interface LeaveRequestHRDTO {
  id: number;
  employeeName: string;
  employeeDepartment: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  justification: string;
  headComment?: string;
  hrComment?: string;
  reviewedByHeadName?: string;
  requestDate: string;
  headResponseDate?: string;
  hrResponseDate?: string;
  evidenceImagePath?: string;
}

export interface LeaveHRResponseDTO {
  requestId: number;
  status: LeaveStatus;
  comment: string;
}