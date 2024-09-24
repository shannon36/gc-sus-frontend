import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { IUser, CognitoService } from 'src/app/services/auth/cognito.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit{

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
  userEmail: String;
  //
  tempAWSUserIdOnSignUp: String = "";

  seller!:boolean;


  constructor(private router: Router,
    private cognitoService: CognitoService, private http: HttpClient,public authService: AuthService) {
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
    this.userEmail = '';
    //this.checkIsLoggedIn();

  }

  ngOnInit() {
    this.authService.loginStatus$.subscribe((loggedIn: boolean) => {
      //check if user is registered, if not register show registration

      //this.isLoggedIn = loggedIn;
      console.log("User logged in: " + this.isLoggedIn);
      this.resetBooleanAndMessage();
      this.user.email = this.authService.userProfile['email'];
      this.user.password = 'Abcd1234$';
      this.showSignUp = false;

      console.log(this.showSignUp)
    });
  }
  async checkIsLoggedIn() {
    this.userEmail = '';

    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      this.isLoggedIn = true;
      this.user1 = {} as IUser;
      this.user1 = await this.cognitoService.getUser();
      this.userEmail = this.user1["attributes"]["email"];
    } else {
      this.isLoggedIn = false;
    }
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
      this.cognitoService.signUp(this.user)
        .then((res) => {
          this.resetBooleanAndMessage();
          this.loading = false;
          this.isShowOTP = true;
          console.log("end Signup, successful");
          this.isShowProgressMessage = true;
          this.progressMessage = "An OTP had sent to your email.";
          // console.log(this.user.email);
          this.tempAWSUserIdOnSignUp = res["userSub"];
          // console.log(res["userSub"]);
          alert("Sign up success. Check your email for OTP.");

        }).catch((e) => {
          this.resetBooleanAndMessage();
          this.loading = false;
          console.log("end Signup, failed");
          this.isShowErrorMessage = true;
          this.errorMessage = e.message;
          alert("SIGN UP FAIL");
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
      this.cognitoService.confirmSignUp(this.user)
        .then(() => {
          this.resetBooleanAndMessage();
          this.showSignUp = false;
          this.loading = false;
          this.isShowProgressMessage = true;
          this.progressMessage = "Account registered successfully. Please login now.";
          this.user.password = 'Abcd1234$';
          this.hideSignUpButton = true;
          //post identity to customer db only here

          //
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'accept': '*/*',
          });
          const customerData = {
            id: this.tempAWSUserIdOnSignUp,
            name: this.user.name,
            email: this.user.email,
            roleind: this.seller ? "S" : "C"
          };
         
          var apiUrl = 'http://143.42.79.86/backend/Users/saveUser';
          const options = { headers };

          this.http.post(apiUrl, customerData, options).subscribe(

          );



        }).catch((e) => {
          this.resetBooleanAndMessage();
          this.loading = false;
          console.log("end Signup, failed");
          this.isShowErrorMessage = true;
          this.errorMessage = e.message;
        });
    } else {
      this.isShowErrorMessage = true;
      this.errorMessage = "OTP must be 6 digits.";
      this.loading = false;

    }
  }

  public signIn(): void {
    if (this.user.email != null && this.user.password != null) {

      this.resetBooleanAndMessage();
      this.isShowProgressMessage = true;
      this.progressMessage = "Signing In...";
      this.loading = true;
      this.cognitoService.signIn(this.user)
        .then(() => {
          this.resetBooleanAndMessage();

          this.user.password = 'Abcd1234$';
          //refresh brower
          this.router.navigate(['/home']).then(() => {
            window.location.reload();

          });

        }).catch((e) => {
          this.resetBooleanAndMessage();

          this.loading = false;
          console.log("end sign in, failed");
          this.isShowErrorMessage = true;
          this.errorMessage = e.message;
        });
    } else {
      this.isShowErrorMessage = true;
      this.loading = false;
      this.errorMessage = "Do not leave blanks.";
    }
  }

  public logout(): void {
    console.log("start sign out");

    this.resetBooleanAndMessage();

    this.loading = true;
    this.cognitoService.signOut()
      .then(() => {
        this.user.password = 'Abcd1234$';
        window.location.reload();
      }).catch((e) => {
        this.loading = false;
        console.log("end sign out, failed");
        this.isShowErrorMessage = true;
        this.errorMessage = e.message;
      });
  }
}
