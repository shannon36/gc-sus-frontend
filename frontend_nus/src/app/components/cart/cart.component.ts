import { Component } from '@angular/core';
import { IUserInfo, AuthUtilService } from 'src/app/services/auth/auth-util.service';

@Component({
  selector: 'app-home',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  userInfo: IUserInfo = { email: '', name: '', role: '', id: ''};
  isLoggedIn: boolean = false;
  userEmail:String = '';
  constructor(private authUtilService: AuthUtilService) {}

  ngOnInit(): void {
    // Subscribe to login state
    this.authUtilService.isLoggedIn$().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    // Subscribe to user info updates
    this.authUtilService.getUserInfo$().subscribe((userInfo) => {
      this.userInfo = userInfo;
    });
  }
}
