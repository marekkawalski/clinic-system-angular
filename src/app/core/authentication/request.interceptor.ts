import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarService } from '@app/shared/services/snackbar.service';

export const requestInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>,
) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const toastService: SnackbarService = inject(SnackbarService);

  let authReq = req;
  if (authService.authDataValue) {
    const token = `Basic ${window.btoa(authService.authDataValue.email + ':' + authService.authDataValue.password)}`;
    authReq = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
  }
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        // Handle HTTP errors
        if (err.status === 401) {
          toastService.openFailureSnackBar({
            message: 'Unauthorized request!',
          });
          console.error('Unauthorized request:', err);
          authService.logout();
        } else {
          toastService.openFailureSnackBar({
            message: `${err?.error?.message ?? err?.message}`,
          });
          console.error('HTTP error:', err);
        }
      } else {
        toastService.openFailureSnackBar({
          message: `${err?.error?.message ?? err?.message}`,
        });
        console.error('An error occurred:', err);
      }

      // Re-throw the error to propagate it further
      return throwError(() => err);
    }),
  );
};
