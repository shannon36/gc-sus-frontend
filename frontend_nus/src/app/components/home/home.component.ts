import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, CognitoService } from 'src/app/services/auth/cognito.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import {AuthService} from "../../auth.service";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user: any;
  isLoggedIn: boolean;
  isAuth: any;
  userEmail: string;
  userName!: string;

  constructor(private router: Router, private cognitoService: CognitoService, private customerService: CustomerService,public authService: AuthService, private cd: ChangeDetectorRef)  {
    this.isLoggedIn = false;
    this.userEmail = '';
    this.checkIsLoggedIn();

  }



  async checkIsLoggedIn() {
    // this.userEmail = '';
    //
    // this.isAuth = await this.cognitoService.isAuthenticated();
    // if (this.isAuth && this.isAuth != null) {
    //   this.isLoggedIn = true;
    //   this.user = {} as IUser;
    //   this.user = await this.cognitoService.getUser();
    //   this.userEmail = this.user["attributes"]["email"];
    //   this.customerService.getCustomerInformation(this.userEmail).subscribe(
    //     {
    //       next: data => {
    //         console.log("Customer Info", data);
    //         this.userName = data.name ?? "";
    //
    //       }, error: err => {
    //
    //
    //       }, complete: () => {
    //
    //       }
    //     }
    //   );
    // } else {
    //   this.isLoggedIn = false;
    // }
    // Check if user is authenticated via OAuth2
    this.isLoggedIn = await this.authService.hasValidAccessToken();
    console.log("home this.isLoggedIn:"+this.isLoggedIn);
    if (this.isLoggedIn) {
      // Get user details from the ID token (after successful login)
      this.user = this.authService.userProfile;
      console.log(JSON.stringify(this.user));
      this.userEmail = this.user?.email || ''; // Get email from the profile

      if (this.userEmail) {
        // Fetch additional user information, e.g., role, from the customer service
        this.customerService.getCustomerInformation(this.userEmail).subscribe((data: any) => {
          console.log(data);

          // Extract user name and role from the response
          this.userName = data.name;

        });
      }
    } else {
      // User is not logged in
      this.isLoggedIn = false;
    }
    this.cd.detectChanges();
  }

  navigateToAuth() {
    //this.router.navigate(['/auth']); // Navigate to the 'auth' route
    // Trigger OAuth2 login flow
    this.authService.login();
  }
  logout() {
    // Trigger OAuth2 logout flow
    this.authService.logout();
  }
}
