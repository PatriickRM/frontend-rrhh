import { Observable } from "rxjs";
import { AuthResponse, Credentials } from "../domain/model/auth";
import { AuthRepository } from "../domain/repository/auth.repository";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AUTH_ENDPOINT } from "../../../shared/constants/api";

@Injectable()
export class AuthHttpRepository implements AuthRepository{
  constructor(private http: HttpClient){}

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${AUTH_ENDPOINT}/login`, credentials);
  }

}
