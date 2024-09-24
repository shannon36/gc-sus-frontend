import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { IUser, CognitoService } from 'src/app/services/auth/cognito.service';
import { CustomerService } from './services/customer/customer.service';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  title = 'nusiss-smartcart';
  user: any;
  isLoggedIn: boolean= false;
  isAuth: any;
  userEmail: string;
  isSeller: boolean = false;
  isDisabled: string = "";
  routeName: string = "/products";
  userName: string | undefined;
  constructor(private router: Router, private customerService: CustomerService,public authService: AuthService) {
    //this.isLoggedIn = false;
    this.userEmail = '';
    this.authService.loginStatus$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      console.log("User logged in: " + this.isLoggedIn);
      this.loadUserDetails();
    });
    //this.checkIsLoggedIn().then(r => {});
  }


  async checkIsLoggedIn() {

    // Check if user is authenticated via OAuth2
    this.isLoggedIn = await this.authService.isLoggedIn;
    console.log("this.isLoggedIn: " +this.isLoggedIn);
    if (this.isLoggedIn) {
      // Get user details from the ID token (after successful login)
      this.user = this.authService.userProfile;
      console.log("User info" +JSON.stringify(this.user));
      this.userEmail = this.authService.userProfile['email'] || ''; // Get email from the profile
      console.log("User info" +this.userEmail);
      if (this.userEmail!=null) {
        console.log("DB User ");
        // Fetch additional user information, e.g., role, from the customer service
        this.customerService.getCustomerInformation(this.userEmail).subscribe((data: any) => {
          console.log("DB User "+data);

          // Extract user name and role from the response
          this.userName = data.name;
          this.isSeller = data.roleind === 'S';

          // Set route and disabled status based on the user role
          this.routeName = this.isSeller ? '/addproduct' : '/products';
          this.isDisabled = this.isSeller ? 'disabled' : '';
        });
      }
    } else {
      // User is not logged in
      this.isLoggedIn = false;
    }
  }

  loadUserDetails(){
    this.isLoggedIn = this.authService.isLoggedIn;
    console.log("load user details 1111" +this.isLoggedIn);
    if (this.isLoggedIn) {
      // Get user details from the ID token (after successful login)
      this.user = this.authService.userProfile;
      console.log("User info" +JSON.stringify(this.user));
      this.userEmail = this.authService.userProfile['email'] || ''; // Get email from the profile
      this.userName = this.userEmail;


      if (this.userEmail!=null) {
        // Fetch additional user information, e.g., role, from the customer service
        this.customerService.getCustomerInformation(this.userEmail).subscribe((data: any) => {
          console.log("DB User "+data);

          // Extract user name and role from the response
          this.userName = data.name;
          this.isSeller = data.roleind === 'S';

          // Set route and disabled status based on the user role
          this.routeName = this.isSeller ? '/addproduct' : '/products';
          this.isDisabled = this.isSeller ? 'disabled' : '';
          console.log(this.routeName);
          this.router.navigate([this.routeName]);
        });
        this.router.navigate(['/auth']);
      }
    } else {
      // User is not logged in
      this.isLoggedIn = false;
    }

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
