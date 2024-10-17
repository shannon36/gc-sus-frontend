import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the JWT token from local storage
    const jwtToken = localStorage.getItem('jwt');

    // Clone the request and add the Authorization header with the JWT token if it exists
    if (jwtToken) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${jwtToken}`)
      });

      // Pass the cloned request with the new header to the next handler
      return next.handle(clonedRequest);
    }

    // If no JWT token, pass the request as is
    return next.handle(req);
  }
}
