import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  // Other routes
  { path: 'auth', component: AuthComponent }, // Define the route for 'auth'
  { path: 'home', component: HomeComponent }, // Define the route for 'auth'
  { path: '', component: HomeComponent }, // Define the route for 'auth'
  { path: 'index.html', component: HomeComponent}, // Define the route for 'auth'
  { path: 'index.html', component: HomeComponent},
  // Other routes
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

