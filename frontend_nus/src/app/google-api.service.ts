// import { Injectable } from '@angular/core';
// import {AuthConfig,OAuthService} from "angular-oauth2-oidc";
//
// const oAuthConfig: AuthConfig={
//   issuer: 'https://accounts.google.com', // URL of the OAuth2 provider
//   strictDiscoveryDocumentValidation:false,
//   redirectUri: window.location.origin,          // Redirect URI after login
//   clientId: '1011072988102-op2udhg3rl9un35gnmug8m1rsdob9f8n.apps.googleusercontent.com',                   // Client ID from your OAuth2 provider
//   responseType: 'code',                         // Authorization code flow
//   scope: 'openid profile email',                // Scopes you're requesting
//   showDebugInformation: true,                   // Enable for debugging
//   //requireHttps: true,                           // Ensure HTTPS is required
// }
// @Injectable({
//   providedIn: 'root'
// })
// export class GoogleApiService {
//
//   constructor(private readonly oAuthService: OAuthService) {
//     oAuthService.configure(oAuthConfig)
//     oAuthService.loadDiscoveryDocument().then(()=>{
//       oAuthService.tryLoginImplicitFlow().then(()=>{
//         if(!oAuthService.hasValidAccessToken()){
//           oAuthService.initLoginFlow();
//         }
//         else{
//           oAuthService.loadUserProfile().then((userProfile)=>{
//             console.log(JSON.stringify(userProfile))
//           })
//         }
//       })
//     })
//   }
// }
