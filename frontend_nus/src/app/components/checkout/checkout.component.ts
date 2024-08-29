import { Purchase } from './../../common/purchase';
import { OrderItem } from './../../common/order-item';
import { CheckoutService } from './../../services/checkout/checkout.service';
import { CartService } from './../../services/cart/cart.service';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Orders } from 'src/app/common/orders';
import { response } from 'express';
import { Customer } from 'src/app/common/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { CognitoService, IUser } from 'src/app/services/auth/cognito.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;
  customer: Customer = new Customer();
  isAuth: any;
  user: any;
  userEmail: string;
  paymentRefId: string = "PT001";
  // orderItems: OrderItem[] = [];
  // orderItems: { [index: string]: any } = {};

  constructor(private formBuilder: FormBuilder,
              private theCartService: CartService,
              private customerService: CustomerService,
              private checkoutService: CheckoutService, 
              private cognitoService: CognitoService,
              private router: Router) {
                this.userEmail = "";
              }
              
  ngOnInit(): void {
    this.getCustomerInformation();
    this.reviewCartDetails();
  }

  async getCustomerInformation() {
    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      this.user = {} as IUser;
      this.user = await this.cognitoService.getUser();
      this.userEmail = this.user["attributes"]["email"];

      this.customerService.getCustomerInformation(this.userEmail).subscribe(
        data => {console.log(this.customer)
          this.customer = data
        }
      );
    }
  }
  
  onSubmit() {
    console.log(this.theCartService.cartItems);
    // this.theCartService.cartItems.forEach(cart => {
    //   this.orderItems["productid"]=cart.pdtid;
    //   this.orderItems["quantity"]=cart.quantity;
    //   this.orderItems["productPrice"]=cart.quantity * cart.unitPrice;
    // });
    const cartItems = this.theCartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    const payload = {
      "customer": this.customer,
      "order": {
        "customerid": this.customer.id,
        "customerAddress": this.customer.email,
        "paymentRefId": this.paymentRefId,
        "dateCreated": new Date(),
        "lastUpdated": new Date()
      },
      "orderItems": orderItems
    }
    console.log(payload)

    this.checkoutService.placeOrder(payload).subscribe({
      next: response => {
        console.log(response)
        alert("Your order has beeen received.");
        this.resetCart();
      },
      error: err => {
        alert(`There was an error: ${err.message}`);
      }
    });
  	
  }
              
  reviewCartDetails() {
    // subscribe to theCartService.totalQuantity
    this.theCartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to theCartService.totalPrice
    this.theCartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }
  
  resetCart() {
    // reset cart data 
    this.theCartService.cartItems = [];
    this.theCartService.totalPrice.next(0);
    this.theCartService.totalQuantity.next(0);
  }

}
