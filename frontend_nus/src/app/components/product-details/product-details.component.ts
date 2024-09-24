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
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    const theProductId: string = this.route.snapshot.paramMap.get('pdtid') ?? '';
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
        this.productService.getProductCategoryById(data.catid!).subscribe(
          (res: Product) => {
            data.categoryname = res?.categoryname;
          }
        );

        // Check stock on product load
        this.checkStock();
      }
    );
  }

  checkStock() {
    // Update outOfStock status based on unitsInStock
    this.outOfStock = this.product.unitsInStock === 0;
  }

  addToCart() {
    const theCartItem = new CartItem(this.product);
    theCartItem.stockQty = this.product.unitsInStock;

    if (this.product.unitsInStock! > 0) {
      this.count += 1; // Increment count when adding to cart
      this.product.unitsInStock! -= 1; // Decrease stock by 1

      // Add to cart only if stock is available
      this.cartService.addToCart(theCartItem);

      // Check stock after adding
      this.checkStock();
    } else {
      // Handle case where there's no stock available
      this.outOfStock = true;
      let showStockQty = <HTMLElement>document.getElementById("showStockQty");
      showStockQty.style.color = "red";
    }
  }

  // addToCart() {
  //   const theCartItem = new CartItem(this.product);
  //   theCartItem.stockQty = this.product.unitsInStock;

  //   if (this.product.unitsInStock! > 0) {
  //     this.count += 1; // Increment count when adding to cart
  //     this.product.unitsInStock! -= 1; // Decrease stock by 1

  //     // Save the updated stock quantity to local storage
  //     localStorage.setItem(`product_${this.product.id}`, JSON.stringify(this.product.unitsInStock));

  //     console.log("LocalStorage", localStorage);

  //     // Add to cart only if stock is available
  //     this.cartService.addToCart(theCartItem);

  //     // Check stock after adding
  //     this.checkStock();
  //   } else {
  //     this.outOfStock = true;
  //     let showStockQty = <HTMLElement>document.getElementById("showStockQty");
  //     showStockQty.style.color = "red";
  //   }
  // }

  // handleProductDetails() {
  //   const theProductId: string = this.route.snapshot.paramMap.get('pdtid') ?? '';
  //   this.productService.getProduct(theProductId).subscribe(
  //     data => {
  //       this.product = data;

  //       // Check local storage for previously updated stock
  //       const storedStock = localStorage.getItem(`product_${this.product.id}`);
  //       if (storedStock) {
  //         this.product.unitsInStock = +storedStock; // Use the stored value
  //       }

  //       this.productService.getProductCategoryById(data.catid!).subscribe(
  //         (res: Product) => {
  //           data.categoryname = res?.categoryname;
  //         }
  //       );

  //       // Check stock on product load
  //       this.checkStock();
  //     }
  //   );
  // }


  get isLowStock(): boolean {
    return this.product.unitsInStock! < 10 && this.product.unitsInStock! > 0;
  }

}

