import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { jwtDecode } from 'jwt-decode';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;  // Controls whether we're in login or register mode
  userName: string = '';  // For registering user
  userRole: string = 'C';  // Default role is Customer
  isLoggedIn: boolean = false;  // Flag to check if user is logged in
  loggedInUserName: string = '';  // Holds the logged-in user's name
  loggedInUserRole: string = '';  // Holds the logged-in user's role

  constructor(private router: Router, private http: HttpClient, private oauthService: OAuthService) {
    this.configureOAuth();
  }

  ngOnInit() {
    this.checkIfLoggedIn();  // Check if user is already logged in when the component loads
    this.oauthService.events
      .pipe(filter(e => e.type === 'token_received'))
      .subscribe(_ => this.handleNewToken());
  }

  private configureOAuth() {
    this.oauthService.configure({
      clientId: '1090601764279-2njt06m8470ls2fo7h7aie8rltdjcgns.apps.googleusercontent.com',
      issuer: 'https://accounts.google.com',
      redirectUri: window.location.origin + '/auth',
      scope: 'openid profile email',
      strictDiscoveryDocumentValidation: false,
      responseType: 'token id_token',
      showDebugInformation: true,
      oidc: true,
      customQueryParams: {
        prompt: 'select_account consent'
      }
    });
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  setMode(mode: string) {
    this.isLoginMode = (mode === 'login');
  }

  signIn() {
    this.oauthService.initImplicitFlow('login');  // Trigger Google OAuth flow for login
  }

  onRegisterSubmit() {
    this.oauthService.initImplicitFlow('register');

    localStorage.setItem('userName', this.userName);
    localStorage.setItem('userRole', this.userRole);
  }

  handleNewToken() {
    const idToken = this.oauthService.getIdToken();
    const state = this.oauthService.state;  // Retrieve the state from the OAuth flow
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');

    const headers = { 'id_token': idToken };

    // Use the state to determine which endpoint to call
    if (state === 'login') {
      // Call /auth/token for login
      this.http.get('http://localhost:8080/auth/token', { headers }).subscribe({
        next: (response: any) => {
          localStorage.setItem('jwt', response.jwt_token);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login error', error);
        }
      });
    } else if (state === 'register') {
      // Call /auth/register for registration
      this.http.post('http://localhost:8080/auth/register', { name, role }, { headers }).subscribe({
        next: (response: any) => {
          localStorage.setItem('jwt', response.jwt_token);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Registration error', error);
        }
      });
    }
  }

  checkIfLoggedIn() {
    const jwtToken = localStorage.getItem('jwt');
    // TODO: also validate jwt token somehow?
    if (jwtToken) {
      this.isLoggedIn = true;
      this.decodeJwt(jwtToken);
    } else {
      this.isLoggedIn = false;
    }
  }

  logout() {
    localStorage.removeItem('jwt');  // Remove JWT from local storage
    this.isLoggedIn = false;  // Update UI state
    this.router.navigate(['/auth']);  // Redirect to the auth page or home page
  }

  decodeJwt(token: string) {
    try {
      const decodedToken: any = jwtDecode(token);  // Decode the JWT token

      // Extract user name and role from JWT claims
      this.loggedInUserName = decodedToken.name || 'Unknown';  // Assuming 'name' claim exists
      this.loggedInUserRole = decodedToken.roles || 'User';  // Assuming 'roles' claim exists
    } catch (error) {
      console.error('Error decoding JWT', error);
    }
  }
}
