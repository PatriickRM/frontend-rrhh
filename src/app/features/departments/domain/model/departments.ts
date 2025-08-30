export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  enabled: boolean;
  head?: EmployeeSummary | null;
}

export interface EmployeeSummary {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  positionName: string;
}