import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from './../../services/product/product.service';
import { ProductCategory } from 'src/app/common/product-category';
import { CognitoService, IUser } from 'src/app/services/auth/cognito.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { Product } from 'src/app/common/product';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  user: any;
  user1: any;

  isLoggedIn: boolean = true;
  isAuth: any;
  userEmail: string = "";
  userId: any;
  productForm = this.fb.group({
    sellerid: ['', Validators.required],
    catid: ['', Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    unitPrice: [0, Validators.required],
    unitsInStock: [0, Validators.required],
    dateCreated: [new Date(), Validators.required],
    lastUpdated: [new Date(), Validators.required]
  });
  product: Product = new Product();
  isSubmitted = false;
  productCategories: ProductCategory[] = [];

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private cognitoService: CognitoService,
    private customerService: CustomerService
  ) {
  }

  ngOnInit(): void {
    this.getUserInformation();
    this.listProductCategories();
  }

  async getUserInformation() {
    this.userEmail = '';
    this.userId = '';
    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      this.isLoggedIn = true;
      this.user = {} as IUser;
      this.user = await this.cognitoService.getUser();
      this.userEmail = this.user["attributes"]["email"];
      console.log(this.userEmail)
      this.customerService.getCustomerInformation(this.userEmail).subscribe(data => {
        console.log(data.id)
        this.userId = data.id;
      })

    } else {
      this.isLoggedIn = false;
    }
    console.log(this.isLoggedIn)
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        // console.log("Product Categories="+JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

  onSubmit(): void {
    // console.log(
    //   'submitted form',
    //   this.productForm.value,
    //   this.productForm.invalid
    // );
    console.log(this.productForm.value)
    this.isSubmitted = true;

    this.product = {
      pdtid: "",
      sellerid: this.userId,
      catid: this.productForm.value.catid ? this.productForm.value.catid : "",
      name: this.productForm.value.name ? this.productForm.value.name : "",
      description: this.productForm.value.description ? this.productForm.value.description : "",
      unitPrice: this.productForm.value.unitPrice ? +this.productForm.value.unitPrice : 1,
      unitsInStock: this.productForm.value.unitsInStock ? this.productForm.value.unitsInStock : 0,
      dateCreated: new Date(),
      lastUpdated: new Date()
    }

    this.productService.saveNewProduct(this.product).subscribe({
      next: response => {
        console.log(response);
        this.productForm.reset();
        alert("Product successfully added!");

      },
      error: err => {
        alert(`There was an error: ${err.message}`);
      }
    });

  }
}