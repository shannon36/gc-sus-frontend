import { CartService } from './../../services/cart/cart.service';
import { CartItem } from './../../common/cart-item';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer/customer.service';
import { IUserInfo, AuthUtilService } from 'src/app/services/auth/auth-util.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  userInfo: IUserInfo = { email: '', name: '', role: ''};
  cartItem: CartItem[] = [];
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  isLoggedIn: boolean = false;
  isAuth: any;
  isSeller !: boolean;

  constructor(private cartService: CartService, private customerService: CustomerService, private authUtilService: AuthUtilService) {}

  ngOnInit(): void {
    // Subscribe to login state
    this.authUtilService.isLoggedIn$().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    // Subscribe to user info updates
    this.authUtilService.getUserInfo$().subscribe((userInfo) => {
      this.userInfo = userInfo;
      this.customerService.getCustomerInformation(userInfo.email).subscribe(data => {
        this.isSeller = data.roleind == "S" ? true : false;
      });
    });

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
