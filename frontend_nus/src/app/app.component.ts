import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from './services/customer/customer.service';
import { IUserInfo, AuthUtilService } from './services/auth/auth-util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nusiss-smartcart';

  isLoggedIn: boolean = false;
  userInfo: IUserInfo = { email: '', name: '', role: '', id: ''};

  user: any;
  isAuth: any;
  userEmail: string = '';
  isSeller: boolean = false;
  isDisabled: string = "";
  routeName: string = "/products";
  userName: string | undefined;
  constructor(private router: Router, private customerService: CustomerService, private authUtilService: AuthUtilService) {
    this.isLoggedIn = false;
    // this.userEmail = '';
    this.isLoggedIn = this.authUtilService.checkIfLoggedIn();
  }

  ngOnInit(): void {
    // Subscribe to login state
    this.authUtilService.isLoggedIn$().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    // Subscribe to user info updates
    this.authUtilService.getUserInfo$().subscribe((userInfo) => {
      this.userInfo = userInfo;
      console.log(`[app] user info: ${JSON.stringify(this.userInfo)}`);
      if (this.isLoggedIn) {
        this.user = this.userInfo;
        this.userName = this.userInfo.name;
        this.userEmail = this.userInfo.email;
        this.isSeller = this.userInfo.role == 'S' ? true : false;

        this.isSeller = this.isSeller ? true : false;
        this.routeName = this.isSeller ? "/addproduct" : "/products";
        this.isDisabled = this.isSeller ? "disabled" : "";
      }
    });
  }

  navigateToAuth() {
    this.router.navigate(['/auth']); // Navigate to the 'auth' route
  }
}
