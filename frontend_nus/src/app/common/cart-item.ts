import { Product } from "./product";

export class CartItem {
    pdtid: string | undefined;
    name: string | undefined;
    imageUrl: string | undefined;
    unitPrice: number;
    quantity: number;
    stockQty: string | undefined;

    constructor(product: Product) {
        this.pdtid = product.pdtid;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice ?? 0;
        this.quantity = 1;
        this.stockQty = "0";
    }
}
