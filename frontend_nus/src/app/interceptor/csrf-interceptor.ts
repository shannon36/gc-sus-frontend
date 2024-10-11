import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const xsrfToken = localStorage.getItem('your-csrf-token-key');
        console.log("xsrfToken",xsrfToken);

        if (xsrfToken) {
            request = request.clone({
                setHeaders: {
                    'smartCart-Xsrf-Header': xsrfToken
                }
            });
        }

        return next.handle(request);
    }
}
