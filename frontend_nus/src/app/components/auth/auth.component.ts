import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, CognitoService } from 'src/app/services/auth/cognito.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {

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


  constructor(private router: Router,
    private cognitoService: CognitoService, private http: HttpClient, private customerService: CustomerService, private oauthService: OAuthService) {
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
    this.configureOAuth();
    this.checkIsLoggedIn();

  }

  ngOnInit() {
    this.oauthService.events
      .pipe(filter(e => e.type === 'token_received'))
      .subscribe(_ => this.handleNewToken());
  }

  private configureOAuth() {
    this.oauthService.configure({
      clientId: '1090601764279-2njt06m8470ls2fo7h7aie8rltdjcgns.apps.googleusercontent.com',
      //clientId: '1011072988102-op2udhg3rl9un35gnmug8m1rsdob9f8n.apps.googleusercontent.com',
      issuer: 'https://accounts.google.com',
      // redirectUri: window.location.origin + '/auth',
      redirectUri: 'http://localhost:4200' + '/auth',
      // redirectUri: 'http://localhost:8080/login/oauth2/code/google', // TODO: Spring Boot server URL
      scope: 'openid profile email',
      strictDiscoveryDocumentValidation: false,
      responseType: 'code',
      showDebugInformation: true, // Remove this in production
      oidc: true,
      // Add these lines:
      customQueryParams: {
        prompt: 'select_account consent'
      }
    });
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  private handleNewToken() {
    const idToken = this.oauthService.getIdToken();
    // Send the ID token to your backend for validation and user creation/update
    this.http.post('/api/auth/google', { idToken }).subscribe({
      next: (response: any) => {
        // Handle successful authentication
        // Store the JWT from your backend, if applicable
        localStorage.setItem('jwt', response.jwt);
        this.checkIsLoggedIn();
      },
      error: (error) => {
        console.error('Authentication error', error);
        // Handle error
      }
    });
  }

  async checkIsLoggedIn() {
    this.isLoggedIn = this.oauthService.hasValidAccessToken();
    if (this.isLoggedIn) {
      const claims = this.oauthService.getIdentityClaims();
      this.userEmail = claims['email'];
      this.userName = claims['name'];
      // Fetch additional user information if needed
      this.customerService.getCustomerInformation(this.userEmail).subscribe({
        next: (data) => {
          console.log("Customer Info", data);
          this.userRole = data.roleind ?? "";
        },
        error: (err) => {
          console.error("Error fetching customer information", err);
        }
      });
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
    this.user.password = '';
    this.showSignUp = event.target.innerText == 'Register' ? true : false;
    console.log(this.showSignUp)
  }

  public signUp(): void {
    if (this.user.email != null && this.user.password != null) {

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
          this.user.password = '';
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
    this.oauthService.initLoginFlow();
  }

  public logout(): void {
    this.oauthService.logOut();
    this.router.navigate(['/home']);
  }
}
