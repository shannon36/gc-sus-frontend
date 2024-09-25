import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/services/auth/cognito.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { AppComponent } from '../../app.component';


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

  constructor(private router: Router, private customerService: CustomerService,public appComponent: AppComponent)  {
    this.isLoggedIn = false;
    this.userEmail = '';
    this.checkIsLoggedIn();

  }



  async checkIsLoggedIn() {
    this.appComponent.loginStatus$.subscribe((loggedIn: boolean) => {
      //check if user is registered, if not register show registration
      this.isLoggedIn = this.appComponent.isLoggedIn;
      if(this.isLoggedIn){
        this.user = this.appComponent.user;
        this.userEmail = this.appComponent.userEmail;
        this.userName = this.user.name;
      }
      else{
        this.userEmail = "";
        this.userName = "";
      }
    });
  }

}
