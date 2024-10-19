import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Orders } from 'src/app/common/orders';
import { IUserInfo, AuthUtilService } from 'src/app/services/auth/auth-util.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  userInfo: IUserInfo = { email: '', name: '', role: '', id: ''};
  userEmail: string | undefined;
  orders: Orders[] = [];
  customerId: string | undefined;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private authUtilService: AuthUtilService
  ) {}

  ngOnInit(): void {
    this.handleOrderLists();
  }

  async handleOrderLists() {
    // Subscribe to user info updates
    this.authUtilService.getUserInfo$().subscribe((userInfo) => {
      if (this.userInfo) {
        this.userInfo = userInfo;
        this.userEmail = userInfo.email;
        if (this.userEmail != undefined) {
          this.orderService.findCustomerId(this.userEmail).subscribe(
            data => {
              this.customerId = data.id;
              if (this.customerId != undefined) {
                this.orderService.getOrderListByCusId(this.customerId).subscribe(
                  data => {
                    this.orders = data;
                  }
                )
              }
            }
          );
        }
      }
    });
  }
}
