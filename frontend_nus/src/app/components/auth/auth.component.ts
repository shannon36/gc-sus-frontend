import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs';
import { AuthUtilService } from 'src/app/services/auth/auth-util.service'
import { IUserInfo } from 'src/app/services/auth/auth-util.service';
import { env } from 'src/app/env';

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
  loggedInUserInfo: IUserInfo = { email: '', name: '', role: '', id: ''};
  loggedInUserName: string = '';  // Holds the logged-in user's name
  loggedInUserRole: string = '';  // Holds the logged-in user's role

  constructor(private router: Router, private http: HttpClient, private oauthService: OAuthService, private authUtilService: AuthUtilService) {
    this.configureOAuth();
    this.authUtilService.checkIfLoggedIn();
  }

  ngOnInit() {
    this.authUtilService.isLoggedIn$().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    // Subscribe to user info updates
    this.authUtilService.getUserInfo$().subscribe((userInfo) => {
      this.loggedInUserInfo = userInfo;
      this.loggedInUserName = userInfo.name;
      this.loggedInUserRole = userInfo.role;
    });

    this.oauthService.events
      .pipe(filter(e => e.type === 'token_received'))
      .subscribe(_ => this.handleNewToken());
  }

  private configureOAuth() {
    this.oauthService.configure({
      clientId: env.GOOGLE_OAUTH_CLIENT_ID,
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
    this.oauthService.initImplicitFlow(JSON.stringify({ action: 'login' }));
  }

  // Start OAuth2 flow for registration
  onRegisterSubmit() {
    // Store user details before OAuth flow

    // Set the state parameter to "register"
    const registrationDetails = { action: 'register', action_extra: {userName: this.userName, userRole: this.userRole} };
    const registrationDetailsState = JSON.stringify(registrationDetails);
    this.oauthService.initImplicitFlow(registrationDetailsState);
  }

  handleNewToken() {
    const idToken = this.oauthService.getIdToken();
    const stateJsonString = this.oauthService.state;  // Retrieve the state from the OAuth flow
    const stateJson = JSON.parse(stateJsonString || '{}');
    const state = stateJson['action'];
    const stateExtra = stateJson['action_extra'] || {};

    const params = new HttpParams().set('id_token', idToken);

    // Use the state to determine which endpoint to call
    if (state === 'login') {
      // Call /auth/token for login
      this.http.get(env.API_URL + '/auth/token', { params }).subscribe({
        next: (response: any) => {
          localStorage.setItem('jwt', response.jwt);
          this.authUtilService.checkIfLoggedIn();
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login error', error);
        }
      });
    } else if (state === 'register') {
      // Call /auth/register for registration
      const role = stateExtra.userRole == 'S' ? 'S' : 'C'
      const name = stateExtra.userName;
      params.set('role', role);
      params.set('name', name);
      this.http.post(env.API_URL + '/auth/register', { params }).subscribe({
        next: (response: any) => {
          localStorage.setItem('jwt', response.jwt);
          this.authUtilService.checkIfLoggedIn();
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Registration error', error);
        }
      });
    }
  }

  // Logout functionality
  logout() {
    localStorage.removeItem('jwt');
    this.authUtilService.checkIfLoggedIn();
    this.router.navigate(['/home']);
  }
}
