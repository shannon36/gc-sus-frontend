import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, CognitoService } from 'src/app/services/auth/cognito.service';
import { CustomerService } from 'src/app/services/customer/customer.service';

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
  userRole: string | undefined;

  constructor(private router: Router, private cognitoService: CognitoService, private customerService: CustomerService)  {
    this.isLoggedIn = false;
    this.userEmail = '';
    this.checkIsLoggedIn();

  }

  async checkIsLoggedIn() {
    this.userEmail = '';
    this.userRole = '';

    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      this.isLoggedIn = true;
      this.user = {} as IUser;
      this.user = await this.cognitoService.getUser();
      this.userEmail = this.user["attributes"]["email"];
      this.customerService.getCustomerInformation(this.userEmail).subscribe(
        {
          next: data => {
            console.log("Customer Info", data);
            this.userName = data.name ?? "";
            this.userRole = data.roleind;
          }, error: err => {


          }, complete: () => {

          }
        }
      );
    } else {
      this.isLoggedIn = false;
    }
  }

  navigateToAuth() {
    this.router.navigate(['/auth']); // Navigate to the 'auth' route
  }
}
