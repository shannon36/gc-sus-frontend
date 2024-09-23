import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { CognitoService, IUser } from 'src/app/services/auth/cognito.service';
import { ProductService } from 'src/app/services/product/product.service';
import { Image } from 'src/app/common/image';
import { ImageService } from 'src/app/services/image/image.service';

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
  product!: Product;

  customerService: any;
  userName?: string;

  showUpdateDialog!: boolean;
  showDeleteDialog!: boolean;
  productCategories: ProductCategory[] = [];
  selectedCategory!: string;
  selectedCatid!: string;
  productName!: string;
  description!: string;
  unitPrice!: number;
  stock!: number;
  selectedID!: string;
  dateCreated = new Date();
  selectedImageUrl: string | null = null;
  showImagePopup = false;
  images: Image[] = [];

  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private productService: ProductService,
    private imageService: ImageService) { }

  ngOnInit(): void {
    this.handleProductLists();
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
      }
    );
  }

  async handleProductLists() {
    this.userEmail = '';
    this.isAuth = await this.cognitoService.isAuthenticated();
    if (this.isAuth && this.isAuth != null) {
      this.user = {} as IUser;
      this.user = await this.cognitoService.getUser();
      // console.log("this.user", this.user);
      this.userEmail = this.user["attributes"]["email"];

      if (this.userEmail != undefined) {
        this.productService.getSellerProductList(this.user.username).subscribe(
          data => {
            // console.log("Product List Updated", data);
            this.products = data;
            this.products.forEach(d => {
              let id = d.pdtid?.slice(-4);
              d.id = 'P' + id?.toUpperCase();
            })
            this.products.map(p => {
              this.productService.getProductCategoryById(p.catid!).subscribe(
                (res: Product) => {
                  // console.log("RES", res);
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
    this.selectedID = p.pdtid ?? "";
    this.showDeleteDialog = true;
  }

  delete(): void {
    if (this.selectedID) {
      this.productService.deleteProduct(this.selectedID).subscribe({
        next: (res) => {
          // console.log("Delete response:", res);
          this.showDeleteDialog = false;
          alert("Selected product is deleted!");
          this.handleProductLists();
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
    this.selectedID = p.pdtid ?? "";
    this.dateCreated = p.dateCreated!;
    this.userId = p.sellerid ?? "";
    this.selectedImageUrl = p.imageUrl ?? null;
  }

  close(): void {
    if (this.showUpdateDialog) {
      this.showUpdateDialog = false;
    } else {
      this.showDeleteDialog = false;
    }

  }
  closeImg(): void {
    this.showImagePopup = false;
  }

  save(): void {
    if (this.validateUpdateForm() && this.selectedID) {
      this.product = {
        pdtid: this.selectedID,
        sellerid: this.userId,
        catid: this.selectedCatid,
        name: this.productName,
        description: this.description,
        unitPrice: this.unitPrice,
        imageUrl: this.selectedImageUrl ?? "",
        unitsInStock: this.stock,
        dateCreated: this.dateCreated,
        lastUpdated: new Date()
      }

      console.log("PRODUCT UPDATE", this.product);
      this.productService.updateProduct(this.product, this.selectedID).subscribe({
        next: (res) => {
          console.log("Update response", res);
          this.showUpdateDialog = false;
          alert("Selected product is updated successfully!");
          this.handleProductLists();
        },
        error: err => {
          console.log("Error updating product", err);
        }
      });

      console.log("SAVE");
    } else {
      alert("ERROR");
    }

  }

  validateUpdateForm(): boolean {
    if ((this.productName == "" || this.productName == null) || (this.description == "" || this.description == null) || (this.unitPrice == null) || (this.stock == null) || (this.selectedImageUrl == '' || this.selectedImageUrl == null)) {
      return false;
    } else {
      return true;
    }
  }

  validatePrice(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Regular expression to match valid numbers with leading zero check
    const validNumber = /^(0(\.\d{1,2})?|[1-9]\d*(\.\d{1,2})?)$/;

    if (!validNumber.test(value)) {
      input.value = '';
    }
  }

  validateStock(event: any): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;

    // Regular expression to match valid numbers with leading zero check
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

  loadImages(): void {
    this.imageService.getAllImages().subscribe(
      (data) => {
        this.images = data;
        // console.log("this.images", this.images);
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }

  selectImage(imageId: string): void {
    const selectedImage = this.images.find(image => image.imageid === imageId);
    if (selectedImage) {
      this.selectedImageUrl = selectedImage.imageUrl;
      // console.log('Selected Image URL:', this.selectedImageUrl);
    }
    this.showImagePopup = false;
  }
}
