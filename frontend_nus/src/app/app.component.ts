import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, CognitoService } from 'src/app/services/auth/cognito.service';
import { CustomerService } from './services/customer/customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nusiss-smartcart';
  user: any;
  isLoggedIn: boolean;
  isAuth: any;
  userEmail: string;
  isSeller: boolean = false;
  isDisabled: string = "";
  routeName: string = "/products";
  userName: string | undefined;
  constructor(private router: Router, private cognitoService: CognitoService, private customerService: CustomerService) {
    this.isLoggedIn = false;
    this.userEmail = '';
    this.checkIsLoggedIn();

  }

  async checkIsLoggedIn() {
    this.userEmail = '';

    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      this.isLoggedIn = true;
      this.user = {} as IUser;
      this.user = await this.cognitoService.getUser();
      this.userEmail = this.user["attributes"]["email"];
      console.log(this.userEmail)
      this.customerService.getCustomerInformation(this.userEmail).subscribe(data => {console.log(data)
        this.userName = data.name;
        this.isSeller = data.roleind == "S" ? true: false;
        this.routeName = data.roleind == "S" ? "/addproduct" : "/products";
        this.isDisabled = data.roleind == "S" ? "disabled" : "";
      })
    } else {
      this.isLoggedIn = false;
    }
  }

  navigateToAuth() {
    this.router.navigate(['/auth']); // Navigate to the 'auth' route
  }
}
