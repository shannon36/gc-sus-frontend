import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { IUser } from 'src/app/services/auth/cognito.service';
import { Customer } from 'src/app/common/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  productCategories: ProductCategory[] = [];
  currentCategoryId: string = "C11";
  currentCategoryName: string = "Snacks & Sweets";
  count: number = 0;
  isRegistered: boolean = false;
  isLoggedIn: boolean = false;
  isAuth: any;
  userEmail: string;
  userName: string | undefined;
  userRole: string | undefined;
  user: any;

  constructor(private productService: ProductService,
              private router: Router,
  			      private cartService: CartService,
              private customerService: CustomerService,
              private route: ActivatedRoute,public appComponent: AppComponent) {
  	this.userEmail = '';
  	this.userRole = '';
  	this.checkIsLoggedIn();

  } // to access route parameters

  // similar to postconstruct
  ngOnInit(): void {
    if(!this.isRegistered){
      this.router.navigate(['/auth']);
    }
    this.route.paramMap.subscribe(() => {
      this.listProducts();
      this.listProductCategories();
    });
  }

  async checkIsLoggedIn() {
    this.appComponent.loginStatus$.subscribe((loggedIn: boolean) => {
      //check if user is registered, if not register show registration
      this.isLoggedIn = this.appComponent.isLoggedIn;
      this.user  = this.appComponent.user;
      this.userEmail = this.appComponent.userEmail;
      this.isRegistered = this.appComponent.isRegistered;
        this.customerService.getCustomerInformation(this.userEmail).subscribe(data => {console.log(data.name)
        this.userName = data.name;
        this.userRole = data.roleind;

      })
      console.log("User logged in: " + this.userEmail+"  "+this.userName+"   "+this.userRole);
    });
  }

  listProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('catid');
    // console.log(this.route.snapshot.paramMap.has('catid'))

    if(hasCategoryId) {
      // get 'id' parameter string. convert it from string to number using +
      this.currentCategoryId = this.route.snapshot.paramMap.get('catid') ?? '';

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('categoryname') ?? '';
    } else {
      this.currentCategoryId = "C11";
      this.currentCategoryName = 'Snacks & Sweets';
    }

    // get the products based on category id
    this.productService.getProductList(this.currentCategoryId).subscribe( //method is invoked when you subscribe
      data => {
        this.products=data;
      }
    )
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        // console.log("Product Categories="+JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

  addToCart(theProduct: Product) {
    this.count += 1;
    const theCartItem = new CartItem(theProduct);
    theCartItem.stockQty = theProduct.unitsInStock;
    if(theCartItem.stockQty) {
      if(+theCartItem.stockQty >= this.count) {
        this.cartService.addToCart(theCartItem);
      } else {
        let cartButton = <HTMLElement>document.getElementById("cart["+theCartItem.pdtid+"]");
        cartButton.style.display = "none";
      }
    }
  }
}
