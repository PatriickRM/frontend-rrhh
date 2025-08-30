export interface Employee {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  hireDate: string;
  contractEndDate: string;
  positionTitle: string;
  departmentName: string;
  salary: number;
  status: EmployeeStatus;
  gender: Gender;
}

export interface Position {
  id: number;
  title: string;
  description?: string;
}

export enum EmployeeStatus {
  CONTRATADO = 'CONTRATADO',
  RETIRADO = 'RETIRADO',
  FINALIZADO = 'FINALIZADO'
}

export enum Gender {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO'
}

export interface EmployeeRequest {
  username: string;
  password: string;
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  hireDate: string;
  contractEndDate: string;
  positionId: number;
  departmentId: number;
  salary: number;
  gender: Gender;
}

export interface EmployeeUpdate {
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  hireDate: string;
  contractEndDate: string;
  positionId: number;
  departmentId: number;
  salary: number;
  status: EmployeeStatus;
  gender: Gender;
}