import { Observable } from 'rxjs';
import { Purchase } from './../../common/purchase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = 'https://smartcart.nus.yaphanyee.com';
  // private baseUrl = 'https://smartcart.nus.yaphanyee.com';
  // private baseUrl = "http://13.229.63.255:9090";
  // private baseUrl = "http://13.229.63.255:9090";

  constructor(private httpClient: HttpClient) {
   }

  placeOrder(purchase: Object): Observable<any> {
    const url = `${this.baseUrl}/CheckoutPurchase/checkoutOrderAndItsItems`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*',
    });
    const options = { headers };
    return this.httpClient.post<Object>(url, purchase, options);
  }
}
