// import { Product } from './product';

import { CartItem } from "./cart-item";


export class OrderItem {
    orderitemid: string | undefined;
    quantity: number | undefined;
    productPrice: number | undefined;
    orderid: string | undefined;
    productid: string | undefined;
    name: string | undefined;
    image_url: string | undefined;
    unit_price: number | undefined;

    // constructor(product: Product) {
    //     this.pdtid = product.pdtid;
    //     this.name = product.name;
    //     this.image_url = product.imageUrl;
    //     this.unit_price = product.unitPrice;

    //     this.quantity = 1;
    // }

    constructor(cartItem?: CartItem) {
        if(cartItem) {
            this.productid = cartItem.pdtid;
            this.quantity = cartItem.quantity;
            this.productPrice = cartItem.quantity * cartItem.unitPrice;
        }
    };
}