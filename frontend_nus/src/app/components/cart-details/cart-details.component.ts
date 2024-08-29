import { CartService } from './../../services/cart/cart.service';
import { CartItem } from './../../common/cart-item';
import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/services/auth/cognito.service';

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

  constructor(private cartService: CartService, private cognitoService: CognitoService) {
    this.checkIsLoggedIn();
  }

  ngOnInit(): void {
    this.listCartDetails();
  }

  async checkIsLoggedIn() {

    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  listCartDetails() {
    // get the handle to the cart items
    this.cartItem = this.cartService.cartItems;

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

  incrementQuantity(theCartItem: CartItem) {
    if (theCartItem.stockQty != undefined) {
      if (theCartItem.quantity < +theCartItem.stockQty) {
        this.cartService.addToCart(theCartItem);
      } else {
        let showStockQty = <HTMLElement>document.getElementById("cart-item[" + theCartItem.pdtid + "]");
        showStockQty.style.display = "block";
      }
    }


  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }
}
