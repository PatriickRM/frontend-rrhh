export interface Credentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  fullName: string;   
  roles: string[];
  expiredAt: number;  
}
