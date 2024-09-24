// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private loginStatus = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatus.asObservable();

  constructor(private oauthService: OAuthService) {
    console.log("load1");
    console.log("need login" + oauthService.getIdToken());
    this.configure();
    console.log("load2");
  }

  private configure() {
    // Configure OAuthService with the settings from authConfig
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      const isLoggedIn = this.oauthService.hasValidAccessToken();
      this.loginStatus.next(isLoggedIn);
      console.log("OAuth callback handled.");
    });

    // Load discovery document and attempt to login

  }

  // Trigger the login process
  login() {
    console.log("trigger login");
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.initLoginFlow();
  }

  // Trigger the logout process
  logout() {
    this.oauthService.revokeTokenAndLogout();
    this.oauthService.logOut();
    const isLoggedIn = this.oauthService.hasValidAccessToken();
    this.loginStatus.next(isLoggedIn);
  }

  // Check if user is logged in
  get isLoggedIn(): boolean {
    console.log("Trigger isLoggedIn");
    console.log(this.oauthService.getAccessToken()); // Should log the access token
    return this.oauthService.hasValidAccessToken();

  }

  // Get the user's profile information from the ID token
  get userProfile() {
    //console.log("Trigger isLoggedIn" +this.oauthService.);
    const claims: any = this.oauthService.getIdentityClaims();
    return claims ? claims : null;


  }

  hasValidAccessToken(){
    return this.oauthService.hasValidAccessToken();

  }
}
