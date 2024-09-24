// src/app/auth-config.ts
import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com', // URL of the OAuth2 provider
  strictDiscoveryDocumentValidation:false,
  redirectUri: 'http://localhost:4200/index.html',       // Redirect URI after login
  clientId: '1011072988102-op2udhg3rl9un35gnmug8m1rsdob9f8n.apps.googleusercontent.com',    // Client ID from your OAuth2 provider
  responseType: 'code',                         // Authorization code flow
  scope: 'openid profile email',                // Scopes you're requesting
  showDebugInformation: true,                   // Enable for debugging
  useSilentRefresh: true, // Use silent refresh to renew tokens automatically
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html', // Silent refresh URI
  sessionChecksEnabled: true, // Enable session checks if needed
  dummyClientSecret:'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',
 };

