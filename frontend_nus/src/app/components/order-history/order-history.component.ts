import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Orders } from 'src/app/common/orders';
import { IUser } from 'src/app/services/auth/cognito.service';
import { OrderService } from 'src/app/services/order/order.service';
import { AppComponent } from '../../app.component';

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

  constructor(public appComponent: AppComponent,
    private router: Router,
    private orderService: OrderService) {}

  ngOnInit(): void {
    this.handleOrderLists();
  }

  async handleOrderLists() {
    this.userEmail = '';
    this.appComponent.loginStatus$.subscribe((loggedIn: boolean) => {
      //check if user is registered, if not register show registration
      this.isAuth = this.appComponent.isRegistered;
      this.user = this.appComponent.user;
      this.userEmail = this.appComponent.userEmail;
      if (this.isAuth && this.isAuth != null) {

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
    });

  }
}
