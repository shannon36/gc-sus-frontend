import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiBaseUrl = 'http://143.42.79.86/backend';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/data`, { withCredentials: true });
  }

  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/data`, data, { withCredentials: true });
  }

  initializeCsrfToken(): Observable<void> {
    return this.http.get<void>(`${this.apiBaseUrl}/set-xsrf-cookie`, { withCredentials: true });
  }
}
