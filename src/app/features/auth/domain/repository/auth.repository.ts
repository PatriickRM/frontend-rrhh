import { Observable } from "rxjs";
import { AuthResponse, Credentials } from "../model/auth";

export interface AuthRepository {
  login (credentials: Credentials): Observable<AuthResponse>;
}
