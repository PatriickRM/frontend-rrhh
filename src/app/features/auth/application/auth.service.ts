import { Observable } from "rxjs";
import { AuthResponse, Credentials } from "../domain/model/auth";

export interface AuthService {
  login(credentials: Credentials): Observable<AuthResponse>;
  logout(): void;
  isAuthenticated(): boolean;
  getToken(): string | null;
  getUser(): { usuario: string; rol: string } | null;
  
}
