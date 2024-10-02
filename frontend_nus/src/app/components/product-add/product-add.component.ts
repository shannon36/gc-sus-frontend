import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from './../../services/product/product.service';
import { ProductCategory } from 'src/app/common/product-category';
import { IUser } from 'src/app/services/auth/cognito.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { Product } from 'src/app/common/product';
import { Image } from 'src/app/common/image';
import { ImageService } from 'src/app/services/image/image.service';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  user: any;

  isLoggedIn: boolean = true;
  isAuth: any;
  userEmail: string = "";
  userId?: string;
  images: Image[] = [];
  selectedImageUrl: string | null = null;
  showImagePopup = false;

  productForm = this.fb.group({
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
              private router: Router,
    public appComponent: AppComponent,private customerService: CustomerService,
    private imageService: ImageService
  ) {
  }

  ngOnInit(): void {
    this.getUserInformation();
    this.listProductCategories();
    this.selectedImageUrl = null;
    console.log(this.isAuth)

    if(!this.isAuth){
      this.router.navigate(['/auth']);
    }
  }

  async getUserInformation() {
    this.appComponent.loginStatus$.subscribe((loggedIn: boolean) => {
      //check if user is registered, if not register show registration
      this.isAuth = this.appComponent.isRegistered;
      this.user = this.appComponent.user;
      this.userEmail = this.appComponent.userEmail;
      this.userId = this.appComponent.userId;
    });
    console.log(this.isLoggedIn)
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
        this.productForm.get('catid')!.setValue(this.productCategories[0].catid);
      }
    );
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.productForm.valid && this.selectedImageUrl) {
      this.product = {
        pdtid: "",
        sellerid: this.userId,
        catid: this.productForm.value.catid ? this.productForm.value.catid : "",
        name: this.productForm.value.name ? this.productForm.value.name : "",
        description: this.productForm.value.description ? this.productForm.value.description : "",
        unitPrice: this.productForm.value.unitPrice ? this.productForm.value.unitPrice : 0,
        imageUrl: this.selectedImageUrl ?? "",
        unitsInStock: this.productForm.value.unitsInStock ? this.productForm.value.unitsInStock : 0,
        dateCreated: new Date(),
        lastUpdated: new Date()
      }

      console.log("Product", this.product);

      this.productService.saveNewProduct(this.product).subscribe({
        next: response => {
          this.productForm.reset();
          this.selectedImageUrl = null;
          this.isSubmitted = false;
          alert("Product successfully added!");

        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      });
    }
  }


  validatePrice(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    const validNumber = /^(0(\.\d{1,2})?|[1-9]\d*(\.\d{1,2})?)$/;

    if (!validNumber.test(value)) {
      input.value = '';
    }
  }

  validateStock(event: any): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;

    const validNumber = /^(0|[1-9]\d*)$/;
    const cleanedValue = newValue.replace(/[^0-9]/g, '');

    if (validNumber.test(cleanedValue)) {
      input.value = cleanedValue;
    } else {
      input.value = '';
    }
  }

  onUpload(): void {
    this.loadImages();
    this.showImagePopup = true;
  }

  close(): void {
    this.showImagePopup = false;
  }

  selectImage(imageId: string): void {
    console.log('Clicked Image ID:', imageId);
    const selectedImage = this.images.find(image => image.imageid === imageId);
    if (selectedImage) {
      this.selectedImageUrl = selectedImage.imageUrl;
      console.log('Selected Image URL:', this.selectedImageUrl);
    }
    this.showImagePopup = false;
  }

  loadImages(): void {
    this.imageService.getAllImages().subscribe(
      (data) => {
        this.images = data;
        console.log("this.images", this.images);
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }


}
