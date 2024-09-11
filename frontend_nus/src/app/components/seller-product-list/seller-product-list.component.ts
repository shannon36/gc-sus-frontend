import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { CognitoService, IUser } from 'src/app/services/auth/cognito.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-seller-product-list',
  templateUrl: './seller-product-list.component.html',
  styleUrls: ['./seller-product-list.component.css']
})
export class SellerProductListComponent {
  isAuth: any;
  user: any;
  userEmail: string | undefined;
  userId!: string;
  products: Product[] = [];

  customerService: any;
  userName: any;

  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.handleProductLists();
  }

  // async handleProductLists() {
  //   this.userEmail = '';
  //   this.isAuth = await this.cognitoService.isAuthenticated();
  //   if (this.isAuth && this.isAuth != null) {
  //     this.user = {} as IUser;
  //     this.user = await this.cognitoService.getUser();
  //     console.log("this.user", this.user);
  //     this.userEmail = this.user["attributes"]["email"];

  //     if (this.userEmail != undefined) {
  //       this.productService.getSellerProductList(this.user.username).subscribe(
  //         data => {
  //           console.log("hHELLO",data)
  //           this.products = data;
  //           // this.customerId = data.id;
  //           // if(this.customerId != undefined) {
  //           //   this.orderService.getOrderListByCusId(this.customerId).subscribe(
  //           //     data => {
  //           //       this.orders=data;
  //           //     }
  //           //   )
  //           // }
  //         }
  //       );
  //     }
  //   } else {
  //     this.router.navigate(['/auth'])
  //   }
  // }

  async handleProductLists() {
    this.userEmail = '';
    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      this.user = {} as IUser;
      this.user = await this.cognitoService.getUser();
      console.log("this.user", this.user);
      this.userEmail = this.user["attributes"]["email"];

      if (this.userEmail != undefined) {
        this.productService.getSellerProductList(this.user.username).subscribe(
          data => {
            console.log("Product List Updated", data);
            this.products = data;
          },
          error => {
            console.log("Error fetching products", error);
          }
        );
      }
    } else {
      this.router.navigate(['/auth'])
    }
  }


  deleteProduct(p: Product): void {
    if (p.pdtid) {
      this.productService.deleteProduct(p.pdtid).subscribe({
        next: (res) => {
          console.log("Delete response:", res);
          alert(p.pdtid + " is deleted!");
          this.handleProductLists(); // Refresh the product list
        },
        error: err => {
          console.log("Error deleting product", err);
        }
      });
    } else {
      console.log("Product ID is undefined or null");
    }
  }
  


  updateProduct(p: Product): void {
    console.log("UPDATE", p);
  }

}
