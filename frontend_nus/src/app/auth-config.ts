// src/app/auth-config.ts
import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: 'http://localhost:4200/index.html',
  clientId: '1011072988102-op2udhg3rl9un35gnmug8m1rsdob9f8n.apps.googleusercontent.com',
  scope: 'openid profile email',
  responseType: 'code',
  requireHttps: false, // Set to true in production
  strictDiscoveryDocumentValidation: false ,
  showDebugInformation: true,
  sessionChecksEnabled: true,
  dummyClientSecret :'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',
  disablePKCE: false
 };

