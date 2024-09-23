import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Auth, Amplify } from 'aws-amplify';

export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {


  private authenticationSubject: BehaviorSubject<any>;

  constructor() {
    Amplify.configure({
      Auth: {
        // region: 'ap-south-1',
        //userPoolId: 'us-east-1_VVVzpE65l',
        //userPoolWebClientId: '7f92vjc4evmk3cueu9n36d1f80',
        
        //Shannon - changed it on 26 August 2024 for local host user pool
        userPoolId: 'ap-southeast-2_KocuUvWVB',
        userPoolWebClientId: '6iqdqs7cv61sa28agn08pj98n',
      },
    });
    // console.log(Amplify);
    console.log("AWS Cognito Configure done.");
    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }



  public signUp(user: IUser): Promise<any> {
    console.log("running signup");

    return Auth.signUp({
      username: user.email,
      password: user.password,
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    console.log("running confirm signup");


    return Auth.confirmSignUp(user.email, user.code);
  }

  public signIn(user: IUser): Promise<any> {
    console.log("running sign in");

    return Auth.signIn(user.email, user.password)
      .then(() => {
        this.authenticationSubject.next(true);
      });
  }

  public signOut(): Promise<any> {
    return Auth.signOut()
      .then(() => {
        this.authenticationSubject.next(false);
      });
  }

  public isAuthenticated(): Promise<boolean> {
    console.log("running isAuthenticated");

    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
        .then((user: any) => {
          if (user) {
            return true;
          } else {
            return false;
          }
        }).catch(() => {
          return false;
        });
    }
  }



  // public getUserDetailsToPost(): void{

  //   Auth.currentUserPoolUser().then(
  //     (cognitoUser: any) => {
  //       // console.log(cognitoUser.attributes.email);
  //       this. emailReturn= cognitoUser.attributes.email;
  //       this. awsUserIdReturn= cognitoUser.username;
  //       // return cognitoUser.attributes.email;
  //     }
  //   );
  // }


  public async getUser(): Promise<any> {
    
    return Auth.currentUserInfo();
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser()
      .then((cognitoUser: any) => {
        return Auth.updateUserAttributes(cognitoUser, user);
      });
  }

}