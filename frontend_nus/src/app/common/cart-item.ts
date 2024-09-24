import { Product } from "./product";

export class CartItem {
    pdtid: string | undefined;
    name: string | undefined;
    unitPrice: number;
    quantity: number;
    stockQty: number | undefined;
    imageUrl?: string;

    constructor(product: Product) {
        this.pdtid = product.pdtid;
        this.name = product.name;
        this.unitPrice = product.unitPrice ?? 0;
        this.quantity = 1;
        this.stockQty = 0;
    }
}
