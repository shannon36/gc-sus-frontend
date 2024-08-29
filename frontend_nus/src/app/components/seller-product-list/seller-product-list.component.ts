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
  userId: any;
  products: Product[] = [];
  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.handleProductLists();
  }

  async handleProductLists() {
    this.userEmail = '';
    this.userId = '4070d90c-a2af-4964-a1d6-878dc82accdf';
    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      this.user = {} as IUser;
      this.user = await this.cognitoService.getUser();
      this.userEmail = this.user["attributes"]["email"] ;
      this.userId = this.user["attributes"]["id"] ;
      
      if(this.userEmail != undefined) {
        this.productService.getSellerProductList("4070d90c-a2af-4964-a1d6-878dc82accdf").subscribe(
          data => {console.log(data)
            this.products = data;
            // this.customerId = data.id;
            // if(this.customerId != undefined) {
            //   this.orderService.getOrderListByCusId(this.customerId).subscribe(
            //     data => {
            //       this.orders=data;
            //     }
            //   )
            // }
          }
        );
      }
    } else {
      this.router.navigate(['/auth'])
    }
  }
}
