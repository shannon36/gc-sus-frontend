import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { jwtDecode } from 'jwt-decode';
import { filter } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode: boolean = true;  // Controls whether we're in login or register mode
  userName: string = '';  // For registering user
  userRole: string = 'C';  // Default role is Customer
  isLoggedIn: boolean = false;  // Flag to check if user is logged in
  loggedInUserName: string = '';  // Holds the logged-in user's name
  loggedInUserRole: string = '';  // Holds the logged-in user's role

  constructor(private router: Router, private http: HttpClient, private oauthService: OAuthService) {
    this.configureOAuth();
    this.checkIfLoggedIn();
  }

  ngOnInit() {
    this.oauthService.events
      .pipe(filter(e => e.type === 'token_received'))
      .subscribe(_ => this.handleNewToken());
  }

  private configureOAuth() {
    this.oauthService.configure({
      clientId: '1090601764279-2njt06m8470ls2fo7h7aie8rltdjcgns.apps.googleusercontent.com',
      issuer: 'https://accounts.google.com',
      redirectUri: window.location.origin + '/auth',  // Redirect after OAuth flow
      scope: 'openid profile email',
      strictDiscoveryDocumentValidation: false,
      responseType: 'token id_token',
      showDebugInformation: true,
      oidc: true
    });
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then( () => Promise.resolve() );
  }

  // Switching between login and register mode
  setMode(mode: string) {
    this.isLoginMode = (mode === 'login');
  }

  // Start OAuth2 flow for login
  signIn() {
    // Set the state parameter to "login"
    this.oauthService.initImplicitFlow('login');
  }

  // Start OAuth2 flow for registration
  onRegisterSubmit() {
    // Store user details before OAuth flow
    localStorage.setItem('userName', this.userName);
    localStorage.setItem('userRole', this.userRole);

    // Set the state parameter to "register"
    this.oauthService.initImplicitFlow('register');
  }

  handleNewToken() {
    const idToken = this.oauthService.getIdToken();
    const state = this.oauthService.state;  // Retrieve the state from the OAuth flow
    let role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');

    const headers = { 'id_token': idToken };

    // Use the state to determine which endpoint to call
    if (state === 'login') {
      // Call /auth/token for login
      this.http.get('http://localhost:8080/auth/token', { headers }).subscribe({
        next: (response: any) => {
          localStorage.setItem('jwt', response.jwt);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login error', error);
        }
      });
    } else if (state === 'register') {
      // Call /auth/register for registration
      role = role == 'Seller' ? 'S' : 'C'
      this.http.post('http://localhost:8080/auth/register', { name, role }, { headers }).subscribe({
        next: (response: any) => {
          localStorage.setItem('jwt', response.jwt);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Registration error', error);
        }
      });
    }
  }

  // Check if user is logged in by checking for JWT
  checkIfLoggedIn() {
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      this.isLoggedIn = true;
      this.decodeJwt(jwtToken);
    } else {
      this.isLoggedIn = false;
    }
  }

  // Decode JWT to get user info
  decodeJwt(token: string) {
    try {
      const decodedToken: any = jwtDecode(token);
      this.loggedInUserName = decodedToken.name || 'Unknown';
      this.loggedInUserRole = decodedToken.roles || 'User';
    } catch (error) {
      console.error('Error decoding JWT', error);
    }
  }

  // Logout functionality
  logout() {
    localStorage.removeItem('jwt');
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }
}
