import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Customer } from 'src/app/common/customer';
import { OrderItem } from 'src/app/common/order-item';
import { Orders } from 'src/app/common/orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // private baseUrl = "http://13.229.63.255:9090";
  private baseUrl = "https://smartcart.nus.yaphanyee.com";

  constructor(private httpClient: HttpClient) { }

  getOrderListByCusId(custId: string): Observable<Orders[]> {
    // TODO: need to build URL based on customer id 
    const url = `${this.baseUrl}/Orders/getOrdersByCustomerId?custId=${custId}`;
    return this.httpClient.get<Orders[]>(url).pipe(
      map(response => response)
    );
  }

  findCustomerId(custEmail: string): Observable<Customer> {
    const url = `${this.baseUrl}/Customers/customersEmail?custEmail=${custEmail}`;

    return this.httpClient.get<Customer>(url).pipe(
      map(response => response)
    );
  }

  getOrder(orderId: string): Observable<OrderItem[]> {
    const url = `${this.baseUrl}/OrderItems/findAllOrderItemsByOrderid?orderId=${orderId}`;

    return this.httpClient.get<OrderItem[]>(url).pipe(
      map(response => response)
    );
  }
}
