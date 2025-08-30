import { Observable, tap } from "rxjs";
import { Credentials, AuthResponse } from "../domain/model/auth";
import { AuthService } from "./auth.service";
import { Inject, Injectable } from "@angular/core";
import { AUTH_REPOSITORY } from "../../../shared/tokens/di-tokens";
import { AuthRepository } from "../domain/repository/auth.repository";
import { TokenStorage } from "../../../core/storage/token.storage";

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private repo: AuthRepository,
    private tokenStorage: TokenStorage
  ){}

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.repo.login(credentials).pipe(
      tap(res => this.tokenStorage.set(res.token, { usuario: res.fullName, rol: res.roles[0] }))
    );
  }
  logout(): void {
    this.tokenStorage.clear();
  }
  isAuthenticated(): boolean {
    return !!this.tokenStorage.get();
  }
  getToken(): string | null {
    return this.tokenStorage.get();
  }
  getUser(): { usuario: string; rol: string } | null {
    return this.tokenStorage.getUser();
  }
  

}
