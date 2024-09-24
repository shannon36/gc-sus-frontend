import { CartService } from './../../services/cart/cart.service';
import { CartItem } from './../../common/cart-item';
import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/services/auth/cognito.service';
import { CustomerService } from '../../services/customer/customer.service';

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


  constructor(private cartService: CartService, private cognitoService: CognitoService, private customerService: CustomerService) {
    this.checkIsLoggedIn();
  }

  ngOnInit(): void {
  
    this.loadCart(); // Load cart from session storage
    this.listCartDetails();
  }

  loadCart(): void {
    const savedCart = sessionStorage.getItem('cartItem');
    if (savedCart) {
      this.cartItem = JSON.parse(savedCart);
      this.cartService.cartItems = this.cartItem; // Sync with the cart service
    } else {
      this.cartItem = []; // Ensure products is initialized to an empty array if nothing is saved
    }
  }

  async checkIsLoggedIn() {

    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      let userEmail = "";
      let user = await this.cognitoService.getUser();
      userEmail = user["attributes"]["email"];
      this.customerService.getCustomerInformation(userEmail).subscribe(data => {
        this.isSeller = data.roleind == "S" ? true : false;
      });
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
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
    sessionStorage.setItem('cartItem', JSON.stringify(this.cartItem));
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
