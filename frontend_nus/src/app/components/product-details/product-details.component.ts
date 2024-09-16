import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  product: Product = new Product();
  outOfStock: boolean = false;
  count: number = 0;

  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {    
    
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }
  handleProductDetails() {
    // get the 'id' param string.
    const theProductId: string = this.route.snapshot.paramMap.get('pdtid') ?? '';
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
        if(this.product.unitsInStock == 0)
        {
          this.outOfStock = true
        }
      }
    )
    
  }

  addToCart() {
    this.count += 1;
    const theCartItem = new CartItem(this.product);
    theCartItem.stockQty = this.product.unitsInStock;
    if(theCartItem.stockQty) {
      if(+theCartItem.stockQty >= this.count) {
        this.cartService.addToCart(theCartItem);
      } else {
        let showStockQty = <HTMLElement>document.getElementById("showStockQty");
        showStockQty.style.color = "red";
      }
    }
    
    
  }
}
