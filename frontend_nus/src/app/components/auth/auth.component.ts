import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs';
import { AuthUtilService } from 'src/app/services/auth/auth-util.service'
import { IUserInfo } from 'src/app/services/auth/auth-util.service';

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
  loggedInUserInfo: IUserInfo = { email: '', name: '', role: ''};
  loggedInUserName: string = '';  // Holds the logged-in user's name
  loggedInUserRole: string = '';  // Holds the logged-in user's role

  constructor(private router: Router, private http: HttpClient, private oauthService: OAuthService, private authUtilService: AuthUtilService) {
    this.configureOAuth();
    this.authUtilService.checkIfLoggedIn();
  }

  ngOnInit() {
    this.authUtilService.isLoggedIn$().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      console.log(`isLoggedIn: ${this.isLoggedIn}`)
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
      const role = stateExtra.userRole == 'Seller' ? 'S' : 'C'
      const name = stateExtra.userName;
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

  // Logout functionality
  logout() {
    localStorage.removeItem('jwt');
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }
}
