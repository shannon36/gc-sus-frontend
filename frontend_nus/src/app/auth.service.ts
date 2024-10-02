import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public loginStatus = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatus.asObservable();

  constructor(private oauthService: OAuthService) {
    console.log("AuthService constructor");
    this.configure();  // Just configure here, don't check login yet
  }

  private configure() {
    // Configure OAuthService with the settings from authConfig
    this.oauthService.configure(authConfig);
    //this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      // Token validation and login status check should happen AFTER the discovery document is loaded
      const isLoggedIn = this.oauthService.hasValidAccessToken();
      this.loginStatus.next(isLoggedIn);
      console.log("OAuth callback handled.");
    }).catch((error) => {
      console.error("OAuth configuration error:", error);
    });
  }

  // Trigger the login process
  login() {
    console.log("trigger login");
    this.oauthService.initLoginFlow();
  }

  // Trigger the logout process
  logout() {
    this.oauthService.revokeTokenAndLogout().then(() => {
      console.log('Logged out');
      this.loginStatus.next(false); // Update login status
    }).catch((error) => {
      console.error('Error during logout:', error);
    });
  }

  // Check if user is logged in
  get isLoggedIn(): boolean {
    console.log("Checking login status");
    console.log("Access Token:", this.oauthService.getAccessToken()); // Logs the access token if available
    return this.oauthService.hasValidAccessToken();
  }

  // Get the user's profile information from the ID token
  get userProfile() {
    const claims: any = this.oauthService.getIdentityClaims();
    return claims ? claims : null;
  }

  hasValidAccessToken(){
    return this.oauthService.hasValidAccessToken();
  }
}
