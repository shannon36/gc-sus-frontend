import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];

  // BehaviorSubject is used to publish latest events that will be sent to all new subscibers
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCartFromSessionStorage();  // Load cart items from sessionStorage during initialization
  }

  // Load cart items from session storage
  private loadCartFromSessionStorage() {
    const storedItems = sessionStorage.getItem('products');
    if (storedItems) {
      const items: CartItem[] = JSON.parse(storedItems);
      items.forEach(item => this.cartItems.push(item));  // Add each item to the cartItems array

      // After loading, remove from session storage
      sessionStorage.removeItem('products');

      // Recompute cart totals based on the loaded items
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    // check if we already have items in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.pdtid === theCartItem.pdtid)!;

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      // increment the quantity
      if (existingCartItem != undefined)
        existingCartItem.quantity++;
    } else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();

  }
  
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity == 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }
  
  remove(theCartItem: CartItem) {
    // get index of item in the array
    const index = this.cartItems.findIndex(tempCartItem => tempCartItem.pdtid === theCartItem.pdtid);

    // if found, remove the item from the array at a given index
    if(index > -1) {
      this.cartItems.splice(index, 1);
      this.computeCartTotals();
    }
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    if(this.cartItems.length > 0) {
      for (let currentCartItem of this.cartItems) {
        totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
        totalQuantityValue += currentCartItem.quantity;

        // publish the new values ... all subscribers will receive the new data
        this.totalPrice.next(totalPriceValue);

        console.log(`[computeCartTotals] totalPrice: ${totalPriceValue}`)
        this.totalQuantity.next(totalQuantityValue);
        console.log(`[computeCartTotals] totalQuantityValue: ${totalQuantityValue}`)
      }
    } else {
      console.log(`[computeCartTotals] cartItems length 0. resetting totalprice and quantity`)
      this.totalPrice.next(0)
      this.totalQuantity.next(0)
    }
  }

  
}
