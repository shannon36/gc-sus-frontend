import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/services/auth/cognito.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../../app.component';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {

  showSignUp: boolean;
  loading: boolean;
  isShowOTP: boolean;
  isShowProgressMessage: boolean;
  progressMessage: string;
  isShowErrorMessage: boolean;
  errorMessage: string;
  hideSignUpButton: boolean;
  user: IUser;
  user1: any;

  isLoggedIn: boolean;
  isAuth: any;
  userEmail: string;
  userName!: string;
  tempAWSUserIdOnSignUp: String = "";

  seller!: boolean;
  userRole!: string;


  constructor(private router: Router, private http: HttpClient,public appComponent: AppComponent) {
    this.loading = false;
    this.isShowOTP = false;
    this.showSignUp = false;
    //
    this.isShowProgressMessage = false;
    this.progressMessage = "";
    this.isShowErrorMessage = false;
    this.errorMessage = ""
    this.hideSignUpButton = false;
    //
    this.user = {} as IUser;
    //
    this.isLoggedIn = false;
    this.userEmail = "";
    this.showSignUp = true;
    this.checkIsLoggedIn();

  }

  async checkIsLoggedIn() {
    this.appComponent.loginStatus$.subscribe((loggedIn: boolean) => {
      //check if user is registered, if not register show registration
      this.isLoggedIn = false;
      this.user  = this.appComponent.user;
      this.userEmail = this.appComponent.userEmail;
      if(!this.appComponent.isLoggedIn){
        this.user= {} as IUser;
        this.userEmail ="";
      }
    });
  }
  public resetBooleanAndMessage(): void {
    this.hideSignUpButton = false;
    this.isShowProgressMessage = false;
    this.progressMessage = "";
    this.isShowErrorMessage = false;
    this.errorMessage = ""
  }

  public onChangeShowSignUp(event: any): void {
    console.log(event.target.innerText)
    this.resetBooleanAndMessage();
    this.user.password = 'Abcd1234$';
    this.showSignUp = event.target.innerText == 'Register' ? true : false;
    console.log(this.showSignUp)
  }

  public signUp(): void {
    if (this.user.email != null) {

      this.resetBooleanAndMessage();
      console.log("Start Signup");
      this.loading = true;
      this.isShowProgressMessage = true;
      this.progressMessage = "Loading (Signing Up)...";
      this.user.code ="dasdas";
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': '*/*',
      });
      const customerData = {
        id: this.user.name,
        name: this.user.name,
        email: this.user.email,
        roleind: this.seller ? "S" : "C"
      };

      var apiUrl = 'http://143.42.79.86/backend/Users/saveUser';
      const options = { headers };

      this.http.post(apiUrl, customerData, options).subscribe(

      );
      this.router.navigate(['/home']).then(() => {
        window.location.reload();

      });
    }
    else {
      this.isShowErrorMessage = true;
      this.errorMessage = "Do not leave blanks.";
      this.loading = false;

    }
  }

  public submitOTP(): void {
    if (this.user.code != null && this.user.code != "" && this.user.code.length === 6) {

      this.resetBooleanAndMessage();
      this.loading = true;
      this.isShowProgressMessage = true;
      this.progressMessage = "Loading (Submitting OTP)...";

    } else {
      this.isShowErrorMessage = true;
      this.errorMessage = "OTP must be 6 digits.";
      this.loading = false;

    }
  }

  public signIn(): void {
    if (this.user.email != null) {

      this.resetBooleanAndMessage();
      this.isShowProgressMessage = true;
      this.progressMessage = "Signing In...";
      this.loading = true;

    } else {
      this.isShowErrorMessage = true;
      this.loading = false;
      this.errorMessage = "Do not leave blanks.";
    }
  }

  public logout(): void {
    console.log("start sign out");

    this.resetBooleanAndMessage();
    sessionStorage.clear();

    this.loading = true;

  }
}
