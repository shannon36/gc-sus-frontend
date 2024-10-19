import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { env } from 'src/app/env';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  private backendApiUrl = env.API_URL;  // Get backend API URL from environment

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem('jwt');

    if (jwtToken && req.url.startsWith(this.backendApiUrl)) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${jwtToken}`)
      });

      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            // If unauthorized or forbidden, redirect to login
            console.error(`User not logged in: ${error.message}`);
            this.router.navigate(['/auth']);
          }
          // Return the error as an observable using throwError
          return throwError(() => error);  // Ensure the error is propagated
        })
      );
    }

    return next.handle(req);
  }
}
