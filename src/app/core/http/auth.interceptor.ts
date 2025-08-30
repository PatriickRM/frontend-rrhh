import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { TokenStorage } from "../storage/token.storage";
import { AUTH_ENDPOINT } from "../../shared/constants/api";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = inject(TokenStorage).get();
  const isLogin = req.url.startsWith(`${AUTH_ENDPOINT}/login`);
  const authReq = (!token || isLogin) ? req : req.clone({setHeaders: {Authorization: `Bearer ${token}`}});
  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401 || err.status === 403){
        inject(TokenStorage).clear();
      }
      return throwError(() => err);
    })
  );
}
