import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
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
  selectedProduct!: Product;

  customerService: any;
  userName: any;

  showUpdateDialog!: boolean;
  productCategories: ProductCategory[] = [];
  selectedCategory!: string;
  selectedCatid!: string;
  productName!: string;
  description!: string;
  unitPrice!: number;
  stock!: number;

  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.handleProductLists();
    this.productService.getProductCategories().subscribe(
      data => {
        // console.log("Product Categories="+JSON.stringify(data));
        this.productCategories = data;
      }
    );
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
            this.products.map(p => {
              this.productService.getProductCategoryById(p.catid!).subscribe(
                (res: Product) => {
                  console.log("RES", res);
                  p.categoryname = res?.categoryname;
                }
              );
              return p;
            })
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
    this.showUpdateDialog = true;
    this.selectedProduct = p;
    this.selectedCatid = p.catid ?? "";
    this.productName = p.name ?? "";
    this.description = p.description ?? "";
    this.unitPrice = p.unitPrice ?? 0;
    this.stock = p.unitsInStock ?? 0;
    console.log("UPDATE", p);
  }

  close(): void {
    this.showUpdateDialog = false;
  }

  save(): void {
    console.log("SAVE");
  }

  validateWholeNumber(value: string) {
    console.log("validateWholeNumber")
    // Regular expression to match whole numbers only
    const isWholeNumber = /^\d+$/.test(value);
    
    if (!isWholeNumber) {
      this.stock = 0; // Reset to null or previous valid value
      // Handle invalid input logic here
      
      console.log("help!")
    }
  }
}
