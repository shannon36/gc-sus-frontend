import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem('jwt');

    if (jwtToken) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${jwtToken}`)
      });

      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            // If unauthorized or forbidden, redirect to login
            this.router.navigate(['/auth']);
          }
          console.error(`User not logged in: ${error}`);
          // Return the error as an observable using throwError
          return throwError(() => error);  // Ensure the error is propagated
        })
      );
    }

    return next.handle(req);
  }
}
