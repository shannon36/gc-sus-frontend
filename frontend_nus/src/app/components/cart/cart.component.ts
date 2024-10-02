import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/services/auth/cognito.service';
import { AppComponent } from '../../app.component';
@Component({
  selector: 'app-home',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  user: any;
  isLoggedIn: boolean;
  isAuth: any;
  userEmail:String;
  constructor(private router: Router, public appComponent: AppComponent) {
    this.isLoggedIn = false;
    this.userEmail='';
     this.checkIsLoggedIn();

  }

  async checkIsLoggedIn() {
    this.appComponent.loginStatus$.subscribe((loggedIn: boolean) => {
      //check if user is registered, if not register show registration
      this.isLoggedIn = this.appComponent.isLoggedIn;

      this.user  = this.appComponent.user;
    });
  }

  navigateToAuth() {
    this.router.navigate(['/auth']); // Navigate to the 'auth' route
  }

}
