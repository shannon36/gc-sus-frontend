import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Orders } from 'src/app/common/orders';
import { CognitoService, IUser } from 'src/app/services/auth/cognito.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  isAuth: any;
  user: any;
  userEmail: string | undefined;
  orders: Orders[] = [];
  customerId: string | undefined;

  constructor(private cognitoService: CognitoService,
    private router: Router,
    private orderService: OrderService) {}

  ngOnInit(): void {
    this.handleOrderLists();
  }

  async handleOrderLists() {
    this.userEmail = '';
    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      this.user = {} as IUser;
      this.user = await this.cognitoService.getUser();
      this.userEmail = this.user["attributes"]["email"] ;
      
      if(this.userEmail != undefined) {
        this.orderService.findCustomerId(this.userEmail).subscribe(
          data => {
            this.customerId = data.id;
            if(this.customerId != undefined) {
              this.orderService.getOrderListByCusId(this.customerId).subscribe(
                data => {
                  this.orders=data;
                }
              )
            }
          }
        );
      }
    } else {
      this.router.navigate(['/auth'])
    }
  }
}
