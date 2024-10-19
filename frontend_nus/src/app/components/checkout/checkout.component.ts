import { OrderItem } from './../../common/order-item';
import { CheckoutService } from './../../services/checkout/checkout.service';
import { CartService } from './../../services/cart/cart.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Customer } from 'src/app/common/customer';
import { CartItem } from 'src/app/common/cart-item';
import { AuthUtilService, IUserInfo } from 'src/app/services/auth/auth-util.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  isLoggedIn: boolean = false;
  userInfo: IUserInfo = { email: '', name: '', role: '', id: ''};
  totalPrice: number = 0;
  totalQuantity: number = 0;
  customer: Customer = new Customer();
  isAuth: any;
  user: any;
  userEmail: string;
  paymentRefId: string = "PT001";
  products: CartItem[] = [];

  constructor(private formBuilder: FormBuilder,
    private theCartService: CartService,
    private checkoutService: CheckoutService,
    private authUtilService: AuthUtilService
  ) {
    this.userEmail = "";
  }

  ngOnInit(): void {
    // this.loadCart(); // Load cart from session storage
    this.reviewCartDetails();
    this.authUtilService.isLoggedIn$().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    // Subscribe to user info updates
    this.authUtilService.getUserInfo$().subscribe((userInfo) => {
      this.userInfo = userInfo;
      console.log(`[productAdd] user info: ${JSON.stringify(this.userInfo)}`);
      if (this.userInfo){
        this.userEmail = userInfo.email;
        this.customer = {
          name: this.userInfo.name,
          email: this.userInfo.email,
          roleind: this.userInfo.role,
          id: this.userInfo.id,
        }
      }
    });
  }

  onSubmit() {
    console.log(this.theCartService.cartItems);
    const cartItems = this.theCartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    const payload = {
      customer: this.customer,
      order: {
        customerid: this.customer.id,
        customerAddress: this.customer.email,
        paymentRefId: this.paymentRefId,
        dateCreated: new Date(),
        lastUpdated: new Date()
      },
      orderItems
    }
    console.log("Payload", payload)

    this.checkoutService.placeOrder(payload).subscribe({
      next: response => {
        console.log(response)
        alert("Your order has beeen received.");
        this.resetCart();
      },
      error: err => {
        alert(`There was an error: ${err.message}`);
        this.resetCart();
      }
    });

  }

  reviewCartDetails() {
    this.products = this.theCartService.cartItems;
    // subscribe to theCartService.totalQuantity
    this.theCartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to theCartService.totalPrice
    this.theCartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

    this.updateCart();
  }

  resetCart() {
    // reset cart data
    this.theCartService.cartItems = [];
    this.theCartService.totalPrice.next(0);
    this.theCartService.totalQuantity.next(0);
    sessionStorage.removeItem('products'); // Clear session storage
  }

  updateCart(): void {
    console.log("UPDATE CHECKOUT");
    sessionStorage.setItem('products', JSON.stringify(this.products));
    alert("UPDATED CHECKOUT");
  }
}
