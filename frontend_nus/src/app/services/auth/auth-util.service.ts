import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { env } from 'src/app/env'
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

export interface IUserInfo {
  email: string;
  name: string;
  role: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})

export class AuthUtilService {
  private apiUrl = env.API_URL;  // Replace with your backend API base URL

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private userInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkIfLoggedIn();  // Automatically check on initialization
  }

  // Expose observables for other components to subscribe
  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUserInfo$(): Observable<IUserInfo> {
    return this.userInfo.asObservable();
  }

  // Check if user is logged in by checking for JWT in localStorage
  checkIfLoggedIn(): boolean {
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      this.fetchUserInfo();  // Fetch user info from backend
      this.decodeJwt(jwtToken);  // Decode JWT
      this.loggedIn.next(true);  // Set logged-in status
      return true;
    } else {
      this.loggedIn.next(false);
      return false;
    }
  }

  // Fetch user information from the backend
  fetchUserInfo(): void {
    this.http.get(`${this.apiUrl}/auth/user`).subscribe({
      next: (response: any) => {
        // Store user info in the BehaviorSubject
        this.userInfo.next(response);
        // Optionally update the JWT if returned by the server
        if (response.jwt) {
          localStorage.setItem('jwt', response.jwt);
        }
      },
      error: (error) => {
        console.error('Error fetching user information:', error);
        this.logout();  // Clear everything if there's an error
      }
    });
  }

  // Decode JWT and store user info in the BehaviorSubject
  decodeJwt(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      const userInfo = {
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.roles,
        id: decodedToken.userId
      } as IUserInfo;
      this.userInfo.next(userInfo);  // Update user information
    } catch (error) {
      console.error('Error decoding JWT:', error);
      this.logout();  // Logout if decoding fails
    }
  }

  // Logout and clear local storage and user information
  logout(): void {
    localStorage.removeItem('jwt');
    this.loggedIn.next(false);
    this.userInfo.next(null);
    this.router.navigate(['/auth']);
  }
}
