import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, CognitoService } from 'src/app/services/auth/cognito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user: any;
  isLoggedIn: boolean;
  isAuth: any;
  userEmail:String;
  constructor(private router: Router, private cognitoService: CognitoService) {
    this.isLoggedIn = false;
    this.userEmail='';
     this.checkIsLoggedIn();

  }

  async checkIsLoggedIn() {
    this.userEmail='';

    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth&&this.isAuth!=null) {
      this.isLoggedIn = true;
      this.user = {} as IUser;
      this.user=await this.cognitoService.getUser();
this.userEmail=this.user["attributes"]["email"];
    } else {
      this.isLoggedIn = false;
    }
  }

  navigateToAuth() {
    this.router.navigate(['/auth']); // Navigate to the 'auth' route
  }
}
