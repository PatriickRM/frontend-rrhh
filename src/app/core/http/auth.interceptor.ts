import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenStorage } from '../storage/token.storage';
import { ToastService } from '../services/toast.service';
import { AUTH_ENDPOINT } from '../../shared/constants/api';

/**
 * Interceptor HTTP unificado:
 *
 * 1. Adjunta el token JWT en el header Authorization (si existe y no es el login).
 * 2. FIX: detecta token expirado ANTES de hacer la petición y redirige al login.
 * 3. FIX: elimina console.log — los errores van al ToastService.
 * 4. Maneja errores HTTP de forma centralizada:
 *    - 401: sesión expirada → limpiar storage → redirigir al login
 *    - 403: sin permisos → toast de advertencia
 *    - 429: rate limit (demasiados intentos de login)
 *    - 0:   sin conexión al servidor
 *    - 4xx/5xx: mensaje descriptivo del backend si existe
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorage);
  const router       = inject(Router);
  const toast        = inject(ToastService);

  const isLoginRequest = req.url.startsWith(`${AUTH_ENDPOINT}/login`);
  const token = tokenStorage.get();

  // Detectar token expirado antes de enviar la petición
  if (!isLoginRequest && token && tokenStorage.isTokenExpired()) {
    tokenStorage.clear();
    toast.warning('Tu sesión expiró. Por favor, inicia sesión de nuevo.');
    router.navigate(['/login']);
    return throwError(() => new Error('Token expirado'));
  }

  // Clonar la petición agregando el token si corresponde
  const authReq = (!token || isLoginRequest)
    ? req
    : req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      switch (error.status) {
        case 0:
          toast.error('No se pudo conectar al servidor. Verifica tu conexión.');
          break;

        case 400: {
          // El backend devuelve { mensaje, errores[] } — mostrar el mensaje
          const msg = error.error?.mensaje
            ?? error.error?.message
            ?? 'Datos inválidos en la solicitud.';
          toast.error(msg);
          break;
        }

        case 401:
          tokenStorage.clear();
          toast.warning('Tu sesión expiró. Por favor, inicia sesión de nuevo.');
          router.navigate(['/login']);
          break;

        case 403:
          toast.warning('No tienes permisos para realizar esta acción.');
          break;

        case 404:
          toast.error('El recurso solicitado no fue encontrado.');
          break;

        case 413:
          toast.error('El archivo adjunto supera el tamaño máximo permitido (10 MB).');
          break;

        case 429:
          toast.error('Demasiados intentos. Espera unos minutos antes de intentarlo de nuevo.');
          break;

        case 500:
        case 502:
        case 503:
          toast.error('Error interno del servidor. Por favor intenta más tarde.');
          break;

        default:
          if (error.status >= 400) {
            const msg = error.error?.mensaje ?? `Error ${error.status}: ${error.statusText}`;
            toast.error(msg);
          }
      }

      return throwError(() => error);
    })
  );
};