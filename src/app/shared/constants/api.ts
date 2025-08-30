import { environment } from "../../../environment/environments.development";

export const API_BASE_URL = environment.apiBaseUrl;
export const AUTH_ENDPOINT = `${API_BASE_URL}/api/auth`;
export const DEPARTMENTS_ENDPOINT = `${API_BASE_URL}/api/departments`;
export const POSITIONS_ENDPOINT = `${API_BASE_URL}/api/positions`;
export const USERS_ENDPOINT = `${API_BASE_URL}/api/users`;
export const EMPLOYEES_ENDPOINT = `${API_BASE_URL}/api/employees`;
export const EMPLOYEE_DASHBOARD_ENDPOINT = `${API_BASE_URL}/api/employee`;