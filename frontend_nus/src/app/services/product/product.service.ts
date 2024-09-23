import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../../common/product';
import { ProductCategory } from 'src/app/common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // private categoryUrl = 'http://localhost:8080/api/product-category';
  // private baseUrl = 'http://localhost:9090';
  private baseUrl = 'http://143.42.79.86/backend';
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

  getProduct(theProductId: string): Observable<Product> {
    console.log(theProductId)
    // need to build url based on product id
    const productUrl = `${this.baseUrl}/Products/getProductsByProductId?pdtId=${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getSellerProductList(thesellerId: string): Observable<Product[]> {
    // need to build url based on seller id
    const url = `${this.baseUrl}/Products/getProductsBySellerId?sellerId=${thesellerId}`;

    return this.httpClient.get<Product[]>(url);
  }

  getProductCategoryById(pdtCatId: string): Observable<Product> {
    const url = `${this.baseUrl}/ProductCategoryController/getProductCategoryById?pdtCatId=${pdtCatId}`;

    return this.httpClient.get<Product>(url);
  }

  saveNewProduct(product: Product): Observable<String> {
    const productUrl = `${this.baseUrl}/Products/saveNewProduct`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*',
    });
    const options = {
      headers,
      responseType: 'text' as 'json'  // Set the response type to 'text'
    };

    return this.httpClient.post<string>(productUrl, product, options);
  }

  // deleteProduct(req?: any): Observable<string> {
  //   const productUrl = `${this.baseUrl}/Products/deleteProductByProductId`;
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'accept': '*/*',
  //   });
  //   const options = {
  //     headers,
  //     responseType: 'text' as 'json'  // Set the response type to 'text'
  //   };

  //   return this.httpClient.post<string>(productUrl, req, options);
  // }

  deleteProduct(pdtId: string): Observable<string> {
    const productUrl = `${this.baseUrl}/Products/deleteProductByProductId`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
    });

    // Create HttpParams to include pdtId as a query parameter
    const params = new HttpParams().set('pdtId', pdtId);

    const options = {
      headers,
      params,
      responseType: 'text' as 'json' // Set the response type to 'text'
    };

    // Use POST instead of DELETE if the backend expects POST
    return this.httpClient.post<string>(productUrl, {}, options);
  }


  updateProduct(productData: Product, pdtId: string): Observable<any> {
    const productUrl =  `${this.baseUrl}/Products/updateProduct`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers,
      responseType: 'text' as 'json'  // Set the response type to 'text'
    };

    return this.httpClient.put(`${productUrl}?pdtId=${pdtId}`, productData, options);
  }
}

// unwrap the JSON from Spring Data REST 
interface GetResponse {
  products: Product[];
}

interface GetResponseProductCategory {
  productCategory: ProductCategory[];
}
