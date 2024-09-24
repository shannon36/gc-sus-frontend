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
import { CartItem } from 'src/app/common/cart-item';

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
  products: CartItem[] = [];

  constructor(private formBuilder: FormBuilder,
    private theCartService: CartService,
    private customerService: CustomerService,
    private checkoutService: CheckoutService,
    private cognitoService: CognitoService,
    private router: Router) {
    this.userEmail = "";
  }

  ngOnInit(): void {
    this.loadCart(); // Load cart from session storage
    this.getCustomerInformation();
    this.reviewCartDetails();
  }

  loadCart(): void {
    const savedCart = sessionStorage.getItem('products');
    if (savedCart) {
      this.products = JSON.parse(savedCart);
      this.theCartService.cartItems = this.products; // Sync with the cart service
    } else {
      this.products = []; // Ensure products is initialized to an empty array if nothing is saved
    }
  }

  async getCustomerInformation() {
    this.userEmail = '';

    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      this.user = {} as IUser;
      this.user = await this.cognitoService.getUser();
      this.userEmail = this.user["attributes"]["email"];
      this.customerService.getCustomerInformation(this.userEmail).subscribe(
        {
          next: data => {
            console.log("Customer Info", data);
            this.customer = data;

          }, error: err => {


          }, complete: () => {

          }
        }
      );
    }
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
  }

  resetCart() {
    // reset cart data 
    this.theCartService.cartItems = [];
    this.theCartService.totalPrice.next(0);
    this.theCartService.totalQuantity.next(0);
    sessionStorage.removeItem('products'); // Clear session storage
  }

  updateCart(): void {
    console.log("UPDATE");
    sessionStorage.setItem('products', JSON.stringify(this.products));
    alert("UPDATED");
  }

  addToCart(item: CartItem): void {
    this.products.push(item);
    this.theCartService.cartItems = this.products;
    this.updateCart(); // Save to session storage
  }

  removeFromCart(item: CartItem): void {
    this.products = this.products.filter(cartItem => cartItem.pdtid !== item.pdtid);
    this.theCartService.cartItems = this.products;
    this.updateCart(); // Save to session storage
  }
}

