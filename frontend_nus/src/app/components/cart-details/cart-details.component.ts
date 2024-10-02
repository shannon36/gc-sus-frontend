import { CartService } from './../../services/cart/cart.service';
import { CartItem } from './../../common/cart-item';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer/customer.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItem: CartItem[] = [];
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  isLoggedIn: boolean = false;
  isAuth: any;
  isSeller !: boolean;


  constructor(private cartService: CartService, private customerService: CustomerService,public appComponent: AppComponent) {
    this.checkIsLoggedIn();
  }

  ngOnInit(): void {
    this.loadCart(); // Load cart from session storage
    this.listCartDetails();
  }

  loadCart(): void {
    const savedCart = sessionStorage.getItem('products');
    if (savedCart) {
      this.cartItem = JSON.parse(savedCart);
      this.cartService.cartItems = this.cartItem; // Sync with the cart service
    } else {
      this.cartItem = []; // Ensure products is initialized to an empty array if nothing is saved
    }
  }

  async checkIsLoggedIn() {
    this.appComponent.loginStatus$.subscribe((loggedIn: boolean) => {
      //check if user is registered, if not register show registration
      this.isLoggedIn = this.appComponent.isLoggedIn;
      if(this.isLoggedIn){
        this.isSeller = this.appComponent.isSeller;
      }
    });
  }


  listCartDetails() {
    // get the handle to the cart items
    this.cartItem = this.cartService.cartItems;
    console.log("this.cartItem", this.cartItem);

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // compute cart total price and quantity
    this.cartService.computeCartTotals();
  }

  updateCart(): void {
    console.log("UPDATE");
    sessionStorage.setItem('products', JSON.stringify(this.cartItem));
    alert("UPDATED");
  }

  incrementQuantity(theCartItem: CartItem) {
    if (theCartItem.stockQty != undefined) {
      if (theCartItem.quantity < +theCartItem.stockQty) {
        this.cartService.addToCart(theCartItem);
        this.cartService.cartItems = this.cartItem;
        this.updateCart();
      } else {
        let showStockQty = <HTMLElement>document.getElementById("cart-item[" + theCartItem.pdtid + "]");
        showStockQty.style.display = "block";
      }
    }


  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
    this.cartService.cartItems = this.cartItem;
    this.updateCart();
  }
}
