import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/services/auth/cognito.service';
import { CustomerService } from './services/customer/customer.service';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

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
  isRegistered: boolean = false;
  userId: string;
  userEmail: string;
  isSeller: boolean = false;
  isDisabled: string = "";
  routeName: string = "/products";
  userName: string | undefined;
  public loginStatus = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatus.asObservable();


  constructor(private router: Router, private customerService: CustomerService,public authService: AuthService) {
    //this.isLoggedIn = false;
    this.userEmail = '';
    this.userId ='';
    this.authService.loginStatus$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      console.log("User logged in: " + this.isLoggedIn);
      this.checkIsLoggedIn();
      this.loginStatus.next(loggedIn);
    });
    //this.checkIsLoggedIn().then(r => {});
  }


  async checkIsLoggedIn() {

    this.isLoggedIn = this.authService.isLoggedIn;
    console.log("load user details 1111" +this.isLoggedIn);
    if (this.isLoggedIn) {
      // Get user details from the ID token (after successful login)
      this.user = this.authService.userProfile;
      console.log("User info" +JSON.stringify(this.user));
      this.userEmail = this.authService.userProfile['email'] || ''; // Get email from the profile
      this.user.email = this.userEmail;
      //this.userName = this.userEmail;
      //this.userEmail = "lynnxin68@gmail.com";
      //this.userName = this.userEmail;
      //this.user.name = this.userEmail;
      //this.user.email = this.userEmail;
      if (this.userEmail!=null) {
        // Fetch additional user information, e.g., role, from the customer service
        this.customerService.getCustomerInformation(this.userEmail).subscribe((data: any) => {
          console.log("DB User "+data.id);
          if(data){
            // Extract user name and role from the response
            this.userName = data.name;
            this.user.name = data.name;

            this.isSeller = data.roleind === 'S';
            this.isRegistered = true;
            this.userId = data.id;
            // Set route and disabled status based on the user role
            this.routeName = this.isSeller ? '/addproduct' : '/products';
            this.isDisabled = this.isSeller ? 'disabled' : '';
            console.log(this.routeName +"   "+data.userId);
            this.router.navigate([this.routeName]);
          }else{
            this.router.navigate(['/auth']);
          }

        });

      }
    } else {
      // User is not logged in
      this.isLoggedIn = false;
      this.isSeller = false;
      this.isRegistered = false;
      this.userName = "";
      this.userEmail ="";
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
    this.router.navigate(['/home']);

  }
}
