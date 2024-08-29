import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../../common/product';
import { ProductCategory } from 'src/app/common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // private categoryUrl = 'http://localhost:8080/api/product-category';
  private baseUrl = 'http://localhost:9090';
  // private baseUrl = 'https://smartcart.nus.yaphanyee.com';

  constructor(private httpClient: HttpClient) { }

  // map json obj to array 
  getProductList(theCategoryId: string): Observable<Product[]> {
    // TODO: need to build URL based on category id
    const searchUrl = `${this.baseUrl}/Products/getProductsByCategoryId?pdtCatId=${theCategoryId}`;

    return this.httpClient.get<Product[]>(searchUrl).pipe(
      map(response => response)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const categoryUrl = `${this.baseUrl}/ProductCategoryController/getProductCategoryList`;
    return this.httpClient.get<ProductCategory[]>(categoryUrl).pipe(
      map(response => response)
    );
  }

  getProduct(theProductId: string): Observable<Product> {console.log(theProductId)
    // need to build url based on product id
    const productUrl = `${this.baseUrl}/Products/getProductsByProductId?pdtId=${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getSellerProductList(thesellerId: string): Observable<Product[]> {
    // need to build url based on seller id
    const url = `${this.baseUrl}/Products/getProductsBySellerId?sellerId=${thesellerId}`;

    return this.httpClient.get<Product[]>(url);
  }
  
  saveNewProduct(product: Product): Observable<any> {
    const productUrl = `${this.baseUrl}/Products/saveNewProduct`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*',
    });
    const options = { headers };
    return this.httpClient.post<Object>(productUrl, product, options);
  }
}

// unwrap the JSON from Spring Data REST 
interface GetResponse {
  products: Product[];
}

interface GetResponseProductCategory {
  productCategory: ProductCategory[];
}
