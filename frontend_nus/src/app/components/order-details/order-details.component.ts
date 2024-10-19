import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderItem } from 'src/app/common/order-item';
import { Product } from 'src/app/common/product';
import { IUserInfo, AuthUtilService } from 'src/app/services/auth/auth-util.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProductService } from 'src/app/services/product/product.service';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {

  userInfo: IUserInfo = { email: '', name: '', role: '', id: ''};
  orders: OrderItem[] = [];
  items: Product[] = [];
  itemQty: { [index: string]: any } = {}
  subTotal: { [index: string]: any } = {}
  total: number = 0;
  isLoggedIn: boolean = false;
  isAuth: any;

  constructor(private orderService: OrderService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private authUtilService: AuthUtilService
  ) {}

  ngOnInit(): void {
    this.authUtilService.isLoggedIn$().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    // Subscribe to user info updates
    this.authUtilService.getUserInfo$().subscribe((userInfo) => {
      this.userInfo = userInfo;
    });
    this.route.paramMap.subscribe(() => {
      this.handleOrderDetails();
    })
  }

  handleOrderDetails() {
    // TODO: Find out what is going on here
    if (this.isLoggedIn) {
      // get the 'id' param string.
      const theOrderId: string = this.route.snapshot.paramMap.get('orderId') ?? '';
      this.orderService.getOrder(theOrderId).subscribe(
        data => {
          this.orders = data;
          this.getProductDetails(this.orders);
        }
      )
    } else {
      this.router.navigate(['/error']);
    }
}

getProductDetails(orders: OrderItem[]) {
  orders.forEach(order => {
    if (order.productid) {
      this.itemQty[order.productid] = order.quantity;
      this.subTotal[order.productid] = (order.productPrice != undefined) ? this.itemQty[order.productid] * order.productPrice : "";
      this.productService.getProduct(order.productid).subscribe(
        data => {
          this.items.push(data);
        }
      );
      this.total += +this.subTotal[order.productid];

    }
  });

}

}
