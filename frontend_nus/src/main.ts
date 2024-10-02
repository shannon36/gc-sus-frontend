import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { bootstrapApplication } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { provideOAuthClient } from 'angular-oauth2-oidc';



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideOAuthClient()
  ]
}).catch(err => console.error(err));
